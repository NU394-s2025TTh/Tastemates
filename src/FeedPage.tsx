import './FeedPage.css';

import { onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';

import logoPic from './assets/logo.png';
import logoText from './assets/logo-text.png';
import Card from './components/Card';
import InvitationsPage from './components/InvitationsPage';
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
  postId?: string;
}

const FeedPage = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    const postsRef = ref(db, 'posts');
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedPosts = Object.entries(data).map(([id, post]) => ({
          ...(post as Post),
          postId: id,
        }));
        loadedPosts.sort((a, b) => b.timestamp - a.timestamp);
        setPosts(loadedPosts);
      }
    });

    return () => unsubscribe();
  }, []);

  return showRequests ? (
    <InvitationsPage onBack={() => setShowRequests(false)} />
  ) : (
    <div className="feed-page">
      <Navbar />
      <div className="top-wrapper">
        <img src={logoPic} alt="Tastemates Logo" className="logo-img" />
        <img src={logoText} alt="Tastemates" className="logo-text" />
      </div>
      <div className="button-row">
        <button onClick={() => setPostModalOpen(true)} className="new-post-button">
          + New Post
        </button>
        <button
          onClick={() => setShowRequests((prev) => !prev)}
          className="requests-button"
        >
          💌
        </button>
      </div>
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
              postId={post.postId}
            />
          ))
        ) : (
          <div className="no-posts-msg">No posts yet. Be the first to share!</div>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
