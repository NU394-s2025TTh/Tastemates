import './PreferencesForm.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserContext } from './userContext';

interface PreferencesFormProps {
  onPreferencesSubmit: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onPreferencesSubmit }) => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const { userId } = useUserContext();
  const navigate = useNavigate();

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => {
      const next = new Set(prev);
      if (next.has(cuisine)) {
        next.delete(cuisine);
      } else {
        next.add(cuisine);
      }
      return new Set(next);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('SUBMITTED');
    e.preventDefault();
    setMessage(
      `Saved! Min: $${priceMin}, Max: $${priceMax}, Cuisines: ${Array.from(selectedCuisines).join(', ')}`,
    );
    onPreferencesSubmit();

    // Add profile information to firebase db
    try {
      const response = await fetch('http://localhost:5000/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'test', //add a form to add username
          minPrice: priceMin,
          maxPrice: priceMax,
          prefs: Array.from(selectedCuisines).join(', '),
          bio: 'this is a bio', //add form for bio maybe?,
          uid: userId,
        }),
      });
      const data = await response.json();
      console.log('Added user to database:', data);
      navigate('/feed');
    } catch (error) {
      console.error('Error adding user to database:', error);
    }
  };

  // navigate('/feed');

  return (
    <form onSubmit={handleSubmit} className="preferences-form">
      <h2 className="section-title">Select your favorite cuisines:</h2>
      <div className="cuisine-buttons">
        {[
          'Mexican',
          'Caribbean',
          'Indian',
          'Italian',
          'Brazilian',
          'Filipino',
          'Korean',
        ].map((cuisine) => (
          <button
            type="button"
            key={cuisine}
            onClick={() => toggleCuisine(cuisine)}
            className={`cuisine-button ${selectedCuisines.has(cuisine) ? 'selected' : ''}`}
          >
            {cuisine}
          </button>
        ))}
      </div>

      <h2 className="section-title">Choose your typical price range:</h2>
      <div className="price-inputs">
        <input
          type="number"
          placeholder="Min"
          value={priceMin}
          onChange={(e) =>
            setPriceMin(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="price-input"
        />
        <input
          type="number"
          placeholder="Max"
          value={priceMax}
          onChange={(e) =>
            setPriceMax(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="price-input"
        />
      </div>

      <button type="submit" className="submit-button">
        Confirm preferences
      </button>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default PreferencesForm;
