// HomePage.tsx
import './App.css';

import React from 'react';
import { useNavigate } from 'react-router-dom';

// import ExplorePage from './ExplorePage';
// import FeedPage from './FeedPage';
// import ProfilePage from './ProfilePage';
// import SignupForm from './SignupForm';
// import SSOCallback from './SSOCallback';
import PreferencesForm from './PreferencesForm';

const HomePage = () => {
  const navigate = useNavigate();

  const goToFeed = () => {
    navigate('/feed');
  };

  return (
    <div className="App">
      <div className="signup-page">
        <div className="signup-container">
          <h1>Welcome to Tastemates!</h1>
          <p style={{ textAlign: 'center' }}>Help us get a sense of your taste!</p>
          <PreferencesForm />
          <button onClick={goToFeed} className="submit-button">
            My Feed
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
