import './EditPreferencesModal.css';

import { useEffect, useState } from 'react';

import { auth, db, get, ref, set } from '../firebase';
import CuisineSelector from './CuisineSelector';

const EditPreferencesModal = ({ onClose, existingPrefs, setPreferences }: any) => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  useEffect(() => {
    setSelectedCuisines(new Set(existingPrefs.cuisines || []));
    setPhoneNumber(existingPrefs.phoneNumber || '');
  }, [existingPrefs]);

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => {
      const next = new Set(prev);
      next.has(cuisine) ? next.delete(cuisine) : next.add(cuisine);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const updatedPrefs = {
      ...existingPrefs,
      cuisines: Array.from(selectedCuisines),
      phoneNumber: phoneNumber || null,
    };

    try {
      await set(ref(db, `users/${user.uid}/preferences`), updatedPrefs);
      setPreferences(updatedPrefs);
      onClose(); // close modal after saving
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };


  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="phone-row">
            <p className="phone">Phone Number:</p>
            <input
              id="phone"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <p>Choose Favorite Cuisines:</p>
          <CuisineSelector
            selectedCuisines={selectedCuisines}
            toggleCuisine={toggleCuisine}
            showAllCuisines={showAllCuisines}
            setShowAllCuisines={setShowAllCuisines}
          />

          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPreferencesModal;
