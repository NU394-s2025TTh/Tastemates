import './ExplorePage.css';

import { useState } from 'react';

import Navbar from './components/Navbar';
// import RestaurantFeed from './components/Restaurants';
import SearchInput from './components/SearchInput';
import UserFeed from './components/Users';

type Tab = 'restaurants' | 'users';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [searchQuery, setSearchQuery] = useState('');

  /** Called by <SearchInput /> */
  const handleSearch = (query: string) => {
    setSearchQuery(query.trim());
  };

  return (
    <div className="explore-page">
      <Navbar />

      {/* ─── Tab navigation ─────────────────────────────────────────────── */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>

        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      {/* ─── Search bar ─────────────────────────────────────────────────── */}
      <SearchInput tab={activeTab} onSearch={handleSearch} />

      {searchQuery && (
        <p className="search-label">
          Showing results for:&nbsp;<strong>{searchQuery}</strong>
        </p>
      )}

      {/* ─── Feed ───────────────────────────────────────────────────────── */}
      {/* {activeTab === 'restaurants' ? (
        <RestaurantFeed key="restaurants" />
      ) : (
        <UserFeed key="users" searchQuery={searchQuery} />
      )} */}
      {activeTab === 'users' && <UserFeed key="users" searchQuery={searchQuery} />}
    </div>
  );
};

export default ExplorePage;
