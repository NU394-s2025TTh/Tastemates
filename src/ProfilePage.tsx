import './ProfilePage.css';

import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from './components/Card';
import Navbar from './components/Navbar';
import { auth, db, get, ref } from './firebase';
import { Restaurant } from './firebaseUtils';

const ProfilePage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [userName, setUserName] = useState<string>('User');
  const [wishlist, setWishlist] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setUserName(user.displayName || 'User');

      const prefSnap = await get(ref(db, `users/${user.uid}/preferences`));
      if (prefSnap.exists()) {
        setPreferences(prefSnap.val());
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
          <img className="user-pic" src="/assets/profile.svg" alt="your user profile" />
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
          <div className="price-container">
            <p>Min: ${preferences.minPrice || 0}</p>
            <p>——</p>
            <p>Max: ${preferences.maxPrice || 0}</p>
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
