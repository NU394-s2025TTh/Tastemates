import './App.css';

import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/clerk-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import FeedPage from './FeedPage';
import GoogleSignupButton from './GoogleSignupButton';
import PreferencesForm from './PreferencesForm';
import SignupForm from './SignupForm';
import SSOCallback from './SSOCallback';

const HomePage = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      {isSignedIn ? (
        <>
          <h2>Welcome, {user?.firstName}!</h2>
          <p>Help us get a sense of your taste!</p>
          <PreferencesForm />
        </>
      ) : (
        <>
          <h1>Welcome to Tastemates!</h1>
          <div className="icon">🍲</div>
          <SignupForm />
          <GoogleSignupButton />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <ClerkLoading>
          <div>Loading...</div>
        </ClerkLoading>
        <ClerkLoaded>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/sso-callback" element={<SSOCallback />} />
            <Route path="/feed-page" element={<FeedPage />} />
          </Routes>
        </ClerkLoaded>
      </div>
    </div>
  );
}

export default App;
