import './CuisineSelector.css';

interface CuisineSelectorProps {
  selectedCuisines: Set<string>;
  toggleCuisine: (cuisine: string) => void;
  showAllCuisines: boolean;
  setShowAllCuisines: (show: boolean) => void;
}

const CuisineSelector = ({ selectedCuisines, toggleCuisine, showAllCuisines, setShowAllCuisines }: CuisineSelectorProps) => {
  const defaultCuisines = [
    'Mexican',
    'Caribbean',
    'Indian',
    'Italian',
    'Brazilian',
    'Filipino',
    'Korean',
    'Chinese',
    'Japanese',
    'American',
    'Thai',
    'French',
  ];
  
  const extraCuisines = [
    'Vietnamese',
    'African',
    'Armenian',
    'German',
    'Belgian',
    'British',
    'Halal',
    'Greek',
    'Kosher',
    'Mediterranean',
    'Mongolian',
    'Scandinavian',
    'Southern',
    'Vegetarian',
    'Vegan',
  ];

  const displayedCuisines = showAllCuisines
    ? [...defaultCuisines, ...extraCuisines]
    : defaultCuisines;

  return (
    <div className="cuisine-buttons">
      {displayedCuisines.map((cuisine) => (
        <button
          type="button"
          key={cuisine}
          onClick={() => toggleCuisine(cuisine)}
          className={selectedCuisines.has(cuisine) ? 'selected' : ''}
          >
          {cuisine}
        </button>
      ))}
        <button
          type="button"
          className="modal-actions"
          id="displayCuisines"
          onClick={() => setShowAllCuisines(!showAllCuisines)}
          >
          {showAllCuisines ? 'Show Less' : 'Show More'}
        </button>
      </div>
 
  );
};

export default CuisineSelector;