import './PreferencesForm.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth, db, ref, set } from './firebase';

const PreferencesForm = () => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => {
      const next = new Set(prev);
      next.has(cuisine) ? next.delete(cuisine) : next.add(cuisine);
      return new Set(next);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setMessage("You're not signed in. Please sign in with Google.");
      return;
    }

    try {
      await set(ref(db, `users/${user.uid}/preferences`), {
        minPrice: priceMin,
        maxPrice: priceMax,
        cuisines: Array.from(selectedCuisines),
      });

      setMessage('Preferences saved!');
      navigate('/feed');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage('Something went wrong while saving your preferences.');
    }
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
