import { useSignUp } from '@clerk/clerk-react';
import React from 'react';

const GoogleSignupButton = () => {
  const { signUp, isLoaded } = useSignUp();

  const handleGoogleSignup = async () => {
    if (!isLoaded) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      console.error('Error with Google signup:', error);
    }
  };

  return (
    <button type="button" className="google-button" onClick={handleGoogleSignup}>
      Sign up with Google
    </button>
  );
};

export default GoogleSignupButton;
