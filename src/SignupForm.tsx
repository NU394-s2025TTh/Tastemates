import { useSignUp } from '@clerk/clerk-react';
import React, { useState } from 'react';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { signUp, isLoaded } = useSignUp();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setMessage('Please check your email to verify your account.');
    } catch (error: unknown) {
      console.error('Error during signup:', error);
      if (error instanceof Error) {
        setMessage(error.message || 'Signup failed. Please try again.');
      } else {
        setMessage('Signup failed. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSignup} className="signup-form">
      <h2>Create an account</h2>
      <input
        type="email"
        placeholder="Email Address"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default SignupForm;
