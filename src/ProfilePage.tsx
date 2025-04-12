import './ProfilePage.css';

import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Range } from 'react-range';
import { useNavigate } from 'react-router-dom';

import Card from './components/Card';
import Navbar from './components/Navbar';
import { auth, db, get, ref, set } from './firebase';
import { Restaurant } from './firebaseUtils';

const MIN = 0;
const MAX = 100;
const STEP = 1;

const ProfilePage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [userName, setUserName] = useState<string>('User');
  const [wishlist, setWishlist] = useState<Restaurant[]>([]);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePriceChange = async (values: [number, number]) => {
    setPriceRange(values);
    const user = auth.currentUser;
    if (!user) return;

    const userPrefRef = ref(db, `users/${user.uid}/preferences`);
    try {
      await set(userPrefRef, {
        ...preferences,
        minPrice: values[0],
        maxPrice: values[1],
      });
      setPreferences((prev: any) => ({
        ...prev,
        minPrice: values[0],
        maxPrice: values[1],
      }));
    } catch (error) {
      console.error('Error updating price preferences:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setUserName(user.displayName || 'User');

      const prefSnap = await get(ref(db, `users/${user.uid}/preferences`));
      if (prefSnap.exists()) {
        const prefs = prefSnap.val();
        setPreferences(prefs);
        setPriceRange([prefs.minPrice || 0, prefs.maxPrice || 100]);
        setPhotoURL(prefs.photoURL || user.photoURL || '/assets/profile.svg');
      }

      const wishlistSnap = await get(ref(db, `wishlists/${user.uid}`));
      if (wishlistSnap.exists()) {
        const data = wishlistSnap.val();
        setWishlist(Object.values(data));
      }
    };

    fetchData();
  }, []);

  if (!preferences) return <div>Loading preferences...</div>;

  return (
    <div className="Profile">
      <Navbar />
      <div className="profile-container">
        <div className="pic-container">
          <img
            className="user-pic"
            src={photoURL || '/assets/profile.svg'}
            alt="your user profile"
          />
        </div>
        <h2>{userName}</h2>

        <div className="pref-card">
          <p className="pref-card-title">Your Favorite Cuisines</p>
          <div className="cuisine-box">
            {preferences.cuisines?.length ? (
              preferences.cuisines.map((cuisine: string) => (
                <p className="cuisine-tag" key={cuisine}>
                  {cuisine}
                </p>
              ))
            ) : (
              <p>No cuisines selected.</p>
            )}
          </div>
        </div>

        <div className="pref-card">
          <p className="pref-card-title">Your Price Range</p>
          <div className="slider-wrapper">
            <p className="price-text">
              ${priceRange[0]} — {priceRange[1] === MAX ? `${MAX}+` : `$${priceRange[1]}`}
            </p>
            <Range
              step={STEP}
              min={MIN}
              max={MAX}
              values={priceRange}
              onChange={(values) => setPriceRange(values as [number, number])}
              onFinalChange={(values) => handlePriceChange(values as [number, number])}
              renderTrack={({ props, children }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '6px',
                    width: '96%',
                    background: '#ccc',
                    borderRadius: '3px',
                    marginTop: '10px',
                    marginLeft: '2%',
                  }}
                >
                  {children}
                </div>
              )}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: '15px',
                    width: '15px',
                    backgroundColor: '#98897e',
                    border: '3px solid white',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                />
              )}
            />
          </div>
        </div>

        <div>
          <h2>Your Tastemates</h2>
          <div className="tastemates-container">
            {['bruce', 'laura', 'nikky', 'daniel', 'marissa', 'zain', 'aninha'].map(
              (name) => (
                <div className="tastemate-box" key={name}>
                  <img
                    className="tastemate-pic"
                    src="/assets/profile.svg"
                    alt="profile"
                  />
                  <div className="tastemate-name">{name}</div>
                </div>
              ),
            )}
          </div>
        </div>

        <div>
          <h2>Your Wishlist</h2>
          <div className="wishlist">
            {wishlist.length > 0 ? (
              wishlist.map((restaurant) => (
                <Card key={restaurant.restaurantName} isFeed={false} {...restaurant} />
              ))
            ) : (
              <p>No wishlisted restaurants yet.</p>
            )}
          </div>
        </div>

        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
