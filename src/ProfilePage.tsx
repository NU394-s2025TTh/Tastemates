import './ProfilePage.css';

import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from './components/Card';
import Navbar from './components/Navbar';
import { auth, db, get, ref } from './firebase';

const ProfilePage = () => {
  const [preferences, setPreferences] = useState<any>(null);
  const [userName, setUserName] = useState<string>('User');
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
      if (user) {
        setUserName(user.displayName || 'User');

        const snapshot = await get(ref(db, `users/${user.uid}/preferences`));
        if (snapshot.exists()) {
          setPreferences(snapshot.val());
        }
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
            {preferences.cuisines && preferences.cuisines.length > 0 ? (
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
                    alt="your user profile"
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
            <Card
              isFeed={false}
              restaurantName="Frida's"
              rating={4.7}
              reviewSrc="https://g.co/kgs/3F6zToD"
              cuisine="Mexican"
              price="$"
            />
            <Card
              isFeed={false}
              restaurantName="Au Cheval"
              rating={4.6}
              reviewSrc="https://g.co/kgs/qQgYj3m"
              cuisine="American"
              price="$$$"
            />
            <Card
              isFeed={false}
              restaurantName="Kasama"
              rating={4.5}
              reviewSrc="https://g.co/kgs/Zo9usNC"
              cuisine="Filipino"
              price="$$"
            />
            <Card
              isFeed={false}
              restaurantName="High Five Ramen"
              rating={4.5}
              reviewSrc="https://g.co/kgs/62qP8o7"
              cuisine="Japanese"
              price="$$"
            />
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
