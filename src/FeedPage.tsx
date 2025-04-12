import './FeedPage.css';

import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';

import logoPic from './assets/logo.png';
import logoText from './assets/logo-text.png';
import Card from './components/Card';
import Navbar from './components/Navbar';
import PostModal from './components/PostModal';
import { db } from './firebase';

interface Post {
  postUser: string;
  profileImg: string;
  caption: string;
  restaurantName: string;
  imgSrc: string;
  rating: number;
  reviewSrc: string;
  cuisine: string;
  price: string;
  timestamp: number;
}

const FeedPage = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts = Object.values(data) as Post[];
        loadedPosts.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(loadedPosts);
      }
    });

    return () => unsubscribe();
  }, []);

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
        {posts.length > 0 ? (
          posts.map((post, i) => (
            <Card
              key={i}
              isFeed={true}
              profileImg={post.profileImg}
              postUser={post.postUser}
              caption={post.caption}
              imgSrc={post.imgSrc}
              restaurantName={post.restaurantName}
              rating={post.rating}
              reviewSrc={post.reviewSrc}
              cuisine={post.cuisine}
              price={post.price}
              timestamp={post.timestamp}
            />
          ))
        ) : (
          <div style={{ fontSize: '2rem', marginTop: '3rem', fontWeight: 'bold' }}>
            No posts yet. Be the first to share!
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
