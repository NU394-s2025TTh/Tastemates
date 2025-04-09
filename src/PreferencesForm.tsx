import './PreferencesForm.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PreferencesFormProps {
  onPreferencesSubmit: () => void;
}

const PreferencesForm: React.FC<PreferencesFormProps> = ({ onPreferencesSubmit }) => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [message, setMessage] = useState('');
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(
      `Saved! Min: $${priceMin}, Max: $${priceMax}, Cuisines: ${Array.from(selectedCuisines).join(', ')}`,
    );
    onPreferencesSubmit();
    navigate('/feed');
    // TODO: Save to Firebase
  };

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
