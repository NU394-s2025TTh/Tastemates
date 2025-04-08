import './App.css';

import React from 'react';

import logo from './394-2025-Logo.svg';

function App() {
  // Gets data back from the server
  const fetchRestaurants = async () => {
    try {
      const lat = 41.8781; // Chicago Latitude
      const lng = 87.6298; // Chicago Longitude
      const term = 'food'; // keyword to search for
      const radius = 40000;

      const response = await fetch(
        `http://localhost:5000/api/restaurants?lat=${lat}&lng=${lng}&term=${term}&radius=${radius}`,
      );

      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        console.log(data);
        return data;
      } else {
        console.error('Error fetching restaurants:', data.error_message);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="header">
          {' '}
          🚀 Vite + React + Typescript + Vitest 🤘 & <br />
          Eslint 🔥+ Prettier for Wildcats
        </p>

        <div className="body">
          {' '}
          <button onClick={fetchRestaurants}>Test API</button>
          <p> Don&apos;t forgot to install Eslint and Prettier in Your Vscode.</p>
          <p>
            Mess up the code in <code>App.tsx </code> and save the file.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitejs.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vite Docs
            </a>
            {' | '}
            <a
              className="App-link"
              href="https://vitest.dev/guide/features.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vitest Docs
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
