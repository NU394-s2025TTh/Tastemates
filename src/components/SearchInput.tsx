import './SearchInput.css';

import React, { useState } from 'react';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchText(newValue);
    onSearch(newValue);
  };

  return (
    <input
      type="text"
      placeholder="Search restaurants..."
      value={searchText}
      onChange={handleChange}
      className="container"
    />
  );
};

export default SearchInput;
