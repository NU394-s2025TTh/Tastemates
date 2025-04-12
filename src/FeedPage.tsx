import './FeedPage.css';

import React, { useState } from 'react';

import logoPic from './assets/logo.png';
import logoText from './assets/logo-text.png';
import Card from './components/Card';
import Navbar from './components/Navbar';
import PostModal from './components/PostModal';

const FeedPage = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);

  return (
    <div className="feed-page">
      <Navbar />
      <div className="top-wrapper">
        <img src={logoPic} alt="Tastemates Logo" className="logo-img" />
        <img src={logoText} alt="Tastemates" className="logo-text" />
      </div>
      <button onClick={() => setPostModalOpen(true)} className="new-post-button">
        + New Post
      </button>
      <PostModal isOpen={isPostModalOpen} onClose={() => setPostModalOpen(false)} />
      <div>
        <Card
          isFeed={true}
          profileImg="/assets/poster-pic.svg"
          postUser="Pedro"
          caption="Best dinner of my life! Must try."
          imgSrc="/assets/calo.jpg"
          restaurantName="Calo Ristorante"
          rating={4.6}
          reviewSrc="https://g.co/kgs/vXuQeiZ"
          cuisine="Italian"
          price="$$"
        />
        <Card
          isFeed={true}
          profileImg="/assets/poster-pic.svg"
          postUser="Carly"
          caption="Primos was SOOOOO good. Who's down to go again next week?"
          imgSrc="/assets/pizza.png"
          restaurantName="Primos"
          rating={4.5}
          reviewSrc="https://g.co/kgs/st6SdLx"
          cuisine="Italian"
          price="$"
        />
      </div>
    </div>
  );
};

export default FeedPage;
