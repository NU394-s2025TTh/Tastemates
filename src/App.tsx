import './App.css';

import { ClerkLoaded, ClerkLoading, useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ExplorePage from './ExplorePage';
import FeedPage from './FeedPage';
import GoogleSignupButton from './GoogleSignupButton';
import PreferencesForm from './PreferencesForm';
import ProfilePage from './ProfilePage';
import SignupForm from './SignupForm';
import SSOCallback from './SSOCallback';
import { UserProvider } from './userContext';

interface HomePageProps {
  onPreferencesSubmit: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPreferencesSubmit }) => {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      {isSignedIn ? (
        <>
          <h2>Welcome, {user?.firstName}!</h2>
          <p>Help us get a sense of your taste!</p>
          <PreferencesForm onPreferencesSubmit={onPreferencesSubmit} />
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
  const { isSignedIn } = useUser();
  const [hasPreferences, setHasPreferences] = useState(false);

  const handlePreferencesSubmit = () => {
    setHasPreferences(true);
  };
  // Gets data back from the server
  // const fetchRestaurants = async () => {
  //   try {
  //     const lat = 41.8781; // Chicago Latitude
  //     const lng = 87.6298; // Chicago Longitude
  //     const term = 'food'; // keyword to search for
  //     const radius = 40000;

  //     const response = await fetch(
  //       `http://localhost:5000/api/restaurants?lat=${lat}&lng=${lng}&term=${term}&radius=${radius}`,
  //     );

  //     const data = await response.json();
  //     if (Array.isArray(data) && data.length > 0) {
  //       console.log(data);
  //       return data;
  //     } else {
  //       console.error('Error fetching restaurants:', data.error_message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching restaurants:', error);
  //   }
  // };

  return (
    <div className="App">
      <UserProvider>
        <div className="signup-page">
          <div className="signup-container">
            <ClerkLoading>
              <div>Loading...</div>
            </ClerkLoading>
            <ClerkLoaded>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onPreferencesSubmit={handlePreferencesSubmit} />}
                />
                <Route path="/sso-callback" element={<SSOCallback />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </ClerkLoaded>
          </div>
        </div>
        {isSignedIn && hasPreferences && <Navbar />}
      </UserProvider>
    </div>
  );
}

export default App;
