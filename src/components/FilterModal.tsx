import './EditPreferencesModal.css';

import { useEffect, useState } from 'react';

import CuisineSelector from './CuisineSelector';

const FilterModal = ({ onClose, filters, setFilters, isFilter }: any) => {
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());
  const [filterPrice, setFilterPrice] = useState<string>();
  const [showAllCuisines, setShowAllCuisines] = useState(false);

  useEffect(() => {
    setSelectedCuisines(new Set(filters || []));
  }, [filters]);

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
      onClose(); // close modal after saving
    } catch (error) {
      console.error('Error updating cuisine filters:', error);
    }
  };

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
            <button type="submit">Search</button>
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
