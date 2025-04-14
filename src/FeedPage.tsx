import './FeedPage.css';

import { getAuth } from 'firebase/auth';
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
  userId: string;
  postId?: string;
}

const FeedPage = () => {
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showRequests, setShowRequests] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

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

  useEffect(() => {
    const cachedCount = localStorage.getItem('pendingCount');
    if (cachedCount) setPendingCount(Number(cachedCount));

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const requestsRef = ref(db, `tastemateRequests/${user.uid}`);
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      const pending = data
        ? Object.values(data).filter((req: any) => req.status === 'pending').length
        : 0;

      localStorage.setItem('pendingCount', pending.toString());
      setPendingCount(pending);
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
          <span className="requests-content" style={{ position: 'relative' }}>
            <svg
              className="icon-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 6.5a4.5 4.5 0 1 1 4.5 4.5A4.49 4.49 0 0 1 12 6.5m6 6.5h-3a3 3 0 0 0-3 3v6h9v-6a3 3 0 0 0-3-3M6.5 6A3.5 3.5 0 1 0 10 9.5 3.5 3.5 0 0 0 6.5 6m1 9h-2A2.5 2.5 0 0 0 3 17.5V22h7v-4.5A2.5 2.5 0 0 0 7.5 15" />
            </svg>
            Tastemate Requests
            {pendingCount > 0 && <span className="badge">{pendingCount}</span>}
          </span>
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
              userId={post.userId}
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
