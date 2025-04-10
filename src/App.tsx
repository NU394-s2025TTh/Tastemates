// App.tsx
import './App.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ExplorePage from './ExplorePage';
import FeedPage from './FeedPage';
import PreferencesForm from './PreferencesForm';
import ProfilePage from './ProfilePage';
// import SignupForm from './SignupForm';
// import SSOCallback from './SSOCallback';

const HomePage = () => {
  return (
    <div className="App">
      <div className="signup-page">
        <div className="signup-container">
          <h1>Welcome, Rachel!</h1>
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
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
