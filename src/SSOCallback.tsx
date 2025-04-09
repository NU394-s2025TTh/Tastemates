import { useSignIn } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SSOCallback = () => {
  const { isLoaded } = useSignIn();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    // Directly navigate to the home page after the component loads
    navigate('/');
  }, [isLoaded, navigate]);

  return <div>Completing authentication...</div>;
};

export default SSOCallback;
