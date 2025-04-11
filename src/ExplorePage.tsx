import { useState } from 'react';

// import Card from './components/Card';
import Navbar from './components/Navbar';
import RestaurantFeed from './components/Restaurants';
import SearchInput from './components/SearchInput';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    console.log('Searched for: ', query);
    // TO DO: actually search and connect w Yelp API
  };
  return (
    <>
      <Navbar />
      <SearchInput onSearch={handleSearch} />
      {searchQuery && (
        <p style={{ padding: '0 1rem' }}>
          Showing results for: <strong>{searchQuery}</strong>
        </p>
      )}
      <RestaurantFeed />
    </>
  );
};

export default ExplorePage;
