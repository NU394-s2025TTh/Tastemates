import './App.css';

import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/clerk-react';
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import GoogleSignupButton from './GoogleSignupButton';
import SignupForm from './SignupForm';
import SSOCallback from './SSOCallback';

const HomePage = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <h1>Welcome to Tastemates!</h1>
      <div className="icon">🍲</div>
      {isSignedIn ? (
        <>
          <h2>Welcome, {user?.firstName}!</h2>
          <p>You are signed in.</p>
        </>
      ) : (
        <>
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
          </Routes>
        </ClerkLoaded>
      </div>
    </div>
  );
}

export default App;
