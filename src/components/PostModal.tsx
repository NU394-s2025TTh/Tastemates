import './PostModal.css';

import React, { useEffect, useState } from 'react';

interface Restaurant {
  name: string;
  rating: number;
  address: string;
  categories: string;
  image_url: string;
  url: string;
  price: string;
}

interface PostModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const PostModal: React.FC<PostModalProps> = ({ onClose, isOpen }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [rating, setRating] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(
          `https://restaurants-e5uwjqpdqa-uc.a.run.app/restaurants?lat=42.055984&lng=-87.675171&radius=10000&term=restaurant`,
        );
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
      }
    };

    if (isOpen) {
      fetchRestaurants();
      // Reset input fields when modal is opened
      setSearch('');
      setSelectedRestaurant('');
      setRating('');
      setCaption('');
      setError('');
      setShowDropdown(false);
    }
  }, [isOpen]);

  const handleSubmit = () => {
    const isValid = restaurants.some(
      (r) => r.name.toLowerCase() === search.toLowerCase(),
    );

    if (!search || !rating || !caption) {
      setError('Please fill out all fields.');
      return;
    }

    if (!isValid) {
      setError('Please select a restaurant from the list.');
      return;
    }

    setSelectedRestaurant(search);
    setError('');
    console.log({ selectedRestaurant: search, rating, caption });
    onClose();
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (name: string) => {
    setSearch(name);
    setShowDropdown(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent, name: string) => {
    if (event.key === 'Enter') {
      handleSelect(name);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Create a Post</h2>

        {/* Restaurant Autocomplete */}
        <div className="dropdown-container">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="modal-input"
          />
          {showDropdown && (
            <ul className="dropdown-list">
              {(search ? filteredRestaurants : restaurants).slice(0, 10).map((r, i) => (
                <li key={i} className="dropdown-item">
                  <button
                    onClick={() => handleSelect(r.name)}
                    onKeyDown={(e) => handleKeyDown(e, r.name)}
                    className="dropdown-item-button" // optional styling class
                  >
                    {r.name}
                  </button>
                </li>
              ))}
              {(search ? filteredRestaurants : restaurants).length === 0 && (
                <li className="no-match">No matches found</li>
              )}
            </ul>
          )}
        </div>

        {/* Rating */}
        <input
          type="number"
          placeholder="Rating (0.0 - 5.0)"
          min="0"
          max="5"
          step="0.1"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="modal-input"
        />

        {/* Caption */}
        <textarea
          placeholder="Write your caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="modal-input"
        />

        {error && <p className="error-message">{error}</p>}

        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
      </div>
    </div>
  );
};

export default PostModal;
