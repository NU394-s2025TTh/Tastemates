import './SearchInput.css';

import React, { useEffect, useState } from 'react';

import { auth, db, get, ref } from '../firebase';
import Card from './Card';
import FilterModal from './FilterModal';

interface SearchInputProps {
  onSearch: (query: string) => void;
  tab: 'restaurants' | 'users';
}

interface Restaurant {
  name: string;
  rating: number;
  address: string;
  categories: string;
  image_url: string;
  url: string;
  price: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, tab }) => {
  const [searchText, setSearchText] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPref, setIsPref] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [selectedCuisines, setSelectedCuisines] = useState<Set<string>>(new Set());

  const [preferences, setPreferences] = useState<any>(null);
  const [priceRange, setPriceRange] = useState<number[]>([1, 2, 3, 4]);

  /* ── fetch user dining prefs (only when in restaurant tab) ───────── */
  useEffect(() => {
    if (tab !== 'restaurants') return;

    const fetchPrefs = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await get(ref(db, `users/${user.uid}/preferences`));
      if (!snap.exists()) return;

      const prefs = snap.val();
      setPreferences(prefs);

      /* map min/max dollars to Yelp price tiers 1‑4 */
      const min = prefs.minPrice ?? 0;
      const max = prefs.maxPrice ?? 100;
      const tiers: number[] = [];
      if (min <= 10 || max <= 10) tiers.push(1);
      if (min <= 30 && max >= 11) tiers.push(2);
      if (min <= 60 && max >= 31) tiers.push(3);
      if (max > 60) tiers.push(4);
      setPriceRange(tiers);
    };

    fetchPrefs();
  }, [tab]);

  /* ── fetch restaurants on search / pref toggle (restaurant tab) ──── */
  useEffect(() => {
    if (tab !== 'restaurants') return;

    const fetchRestaurants = async () => {
      setIsLoading(true);

      const lat = 42.055984;
      const lng = -87.675171;
      const radius = 10000;

      let term = searchText + '+restaurant';
      let categories = '';
      let price = [1, 2, 3, 4];

      if (!searchText.trim()) {
        term = 'restaurant';
      } else {
        setIsPref(false);
      }
      if (isPref) {
        preferences.cuisines.map((pref: string) => {
          term += '+' + pref;
        });

        price = priceRange;
      }

      let url = `https://restaurants-e5uwjqpdqa-uc.a.run.app/restaurants?lat=${lat}&lng=${lng}&term=${term}&radius=${radius}`;
      if (isPref) {
        setIsFilter(false);
        console.log('preferences: ', preferences);
        preferences.cuisines.map((pref: string) => {
          categories += pref.toLowerCase() + ',';
        });
        price = priceRange;
        url += `&price=${price}`;
      } else if (isFilter) {
        Array.from(selectedCuisines).map((pref: string) => {
          categories += pref.toLowerCase() + ',';
        });
        price = priceRange;
        url += `&price=${price}`;
      }

      if (categories) {
        categories = categories.slice(0, -1);
        url += `&categories=${categories}`;
      }

      try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        setRestaurants(data);
      } catch (err) {
        console.error('Failed to fetch restaurants:', err);
        setRestaurants([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [tab, searchText, isPref, isFilter, selectedCuisines, preferences, priceRange]);

  /* ── open/close the filter modal ──────────────────────────────────────────── */
  const openFilterModal = () => {
    setShowFilterModal(true);
  };

  const closeFilterModal = () => {
    setShowFilterModal(false);
  };

  const setFilter = () => {
    setIsFilter(true);
    setIsPref(false);
  };

  const removeCuisine = (cuisine: string) => {
    const newSet = new Set(selectedCuisines);
    const removed = newSet.delete(cuisine);
    if (removed) {
      setSelectedCuisines(newSet);
    }
    console.log(selectedCuisines);
  };

  /* ── search box handler ──────────────────────────────────────────── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    window.scrollTo({ top: 0, behavior: 'auto' });
    setSearchText(value);
    onSearch(value); // Users tab needs this
  };

  /* ── render ──────────────────────────────────────────────────────── */
  return (
    <div>
      <input
        type="text"
        placeholder={`Search ${tab}`}
        value={searchText}
        onChange={handleChange}
        className="container"
      />

      {/* everything below is visible ONLY on the Restaurants tab */}
      {tab === 'restaurants' && (
        <>
          {!isLoading && (
            <div className="pref-buttons">
              <button
                onClick={openFilterModal}
                className={`pref-button ${isFilter ? 'active' : ''}`}
              >
                Search By Cuisine
              </button>
              <button
                onClick={() => {
                  setIsPref(!isPref);
                  setIsFilter(false);
                }}
                className={`pref-button ${isPref ? 'active' : ''}`}
              >
                Based on my preferences
              </button>
            </div>
          )}
          {isFilter && (
            <div className="filters">
              {Array.from(selectedCuisines).map((cuisine) => (
                <div key={cuisine} className="filter">
                  <button type="button" onClick={() => removeCuisine(cuisine)}></button>
                  {cuisine}
                </div>
              ))}
            </div>
          )}
          {isLoading ? (
            <div style={{ fontSize: '2rem', marginTop: '3rem', fontWeight: 'bold' }}>
              Loading restaurants...
            </div>
          ) : (
            restaurants.map((r, idx) => (
              <Card
                key={idx}
                isFeed={false}
                profileImg={r.image_url}
                restaurantName={r.name}
                rating={r.rating}
                reviewSrc={r.url}
                cuisine={r.categories}
                price={r.price}
              />
            ))
          )}

          {!isLoading && restaurants.length === 0 && (
            <div style={{ fontSize: '2rem', marginTop: '3rem', fontWeight: 'bold' }}>
              No restaurants found.
            </div>
          )}
          {showFilterModal && (
            <FilterModal
              onClose={closeFilterModal}
              filters={selectedCuisines}
              setFilters={setSelectedCuisines}
              isFilter={setFilter}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchInput;
