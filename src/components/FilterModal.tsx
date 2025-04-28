import './EditPreferencesModal.css';
import CuisineSelector from './CuisineSelector'

import { useEffect, useState } from 'react';


// interface FilterModalProps {
//   onClose: () => void;
//   selectedCuisines: Set<string>;
//   setSelectedCuisines: React.Dispatch<React.SetStateAction<Set<string>>>;
  // selectedPriceRange: string;
  // setSelectedPriceRange: React.Dispatch<React.SetStateAction<string>>;
// }

const FilterModal = ({ onClose, filters, setFilters, isFilter }: any) => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [showAllCuisines, setShowAllCuisines] = useState(false);


  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) => {
      const next = new Set(prev);
      next.has(cuisine) ? next.delete(cuisine) : next.add(cuisine);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      setFilters(selectedCuisines);
      isFilter(true);
      // setSelectedPriceRange(selectedPriceRange)
      onClose(); // close modal after saving
    } catch (error) {
      console.error('Error updating cuisine filters:', error);
    }
  }
  

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Filters</h2>
        <form onSubmit={handleSubmit}>
          <CuisineSelector
            selectedCuisines={selectedCuisines}
            toggleCuisine={toggleCuisine}
            showAllCuisines={showAllCuisines}
            setShowAllCuisines={setShowAllCuisines}
          />
          <div className="modal-actions">
            <button type="submit">
              Save
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterModal;
