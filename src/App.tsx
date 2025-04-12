import './App.css';

import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import logo from './assets/Tastemates.png';
import ExplorePage from './ExplorePage';
import FeedPage from './FeedPage';
import { auth, db, get, provider, ref, signInWithPopup } from './firebase';
import PreferencesForm from './PreferencesForm';
import ProfilePage from './ProfilePage';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userChecked, setUserChecked] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for preferences in Realtime DB
      const snapshot = await get(ref(db, `users/${user.uid}/preferences`));
      if (snapshot.exists()) {
        navigate('/feed');
      } else {
        navigate('/preferences');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const snapshot = await get(ref(db, `users/${user.uid}/preferences`));
        if (snapshot.exists()) {
          navigate('/explore');
        } else {
          navigate('/preferences');
        }
      }
      setUserChecked(true);
    };
    checkUser();
  }, [navigate]);

  if (!userChecked) return <div>Loading...</div>;

  return (
    <div className="App">
      <div className="signup-page">
        <div className="signup-container">
          <img src={logo} alt="Tastemates Logo" className="logo-image" />
          <h1 style={{ marginTop: '0' }}>Welcome!</h1>
          <p style={{ textAlign: 'center' }}>Sign in to get started</p>
          <button className="google-signin-button" onClick={handleGoogleSignIn}>
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google Logo"
              className="google-icon"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

const PreferencesPage = () => {
  return (
    <div className="App">
      <div className="signup-page">
        <div className="signup-container">
          <h1>Welcome!</h1>
          <p style={{ textAlign: 'center' }}>Help us get a sense of your taste!</p>
          <PreferencesForm />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
