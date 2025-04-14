import './Card.css';

import { getAuth } from 'firebase/auth';
import { get, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';

import { db } from '../firebase';
import { isRestaurantWishlisted, toggleWishlist } from '../firebaseUtils';
import ConnectCard from './ConnectCard';

interface CardProps {
  isFeed: boolean;
  profileImg?: string;
  postUser?: string;
  caption?: string;
  imgSrc?: string;
  restaurantName: string;
  rating: number;
  reviewSrc: string;
  cuisine: string;
  price: string;
  timestamp?: number;
  userId: string;
  postId?: string;
}

const Card: React.FC<CardProps> = ({
  isFeed,
  profileImg,
  postUser,
  caption,
  imgSrc,
  restaurantName,
  rating,
  reviewSrc,
  cuisine,
  price,
  timestamp,
  userId,
  postId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted'>(
    'none',
  );
  const [isWishlist, setIsWishlist] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Check if restaurant is already in wishlist on mount
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!user || !restaurantName) return;
      try {
        const isWishlisted = await isRestaurantWishlisted(restaurantName);
        setIsWishlist(isWishlisted);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlistStatus();
  }, [user, restaurantName]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !postUser || user.uid === userId) return;

      const requestRef = ref(db, `tastemateRequests/${userId}/${user.uid}`);
      const requestSnap = await get(requestRef);

      if (!requestSnap.exists()) {
        setFollowStatus('none');
        return;
      }

      const status = requestSnap.val().status;
      if (status === 'pending') setFollowStatus('pending');
      else if (status === 'accepted') setFollowStatus('accepted');
      else setFollowStatus('none');
    };

    checkFollowStatus();
  }, [user, userId, postUser]);

  const handleWishlistClick = async () => {
    if (!user) return;
    const newState = await toggleWishlist({
      restaurantName,
      rating,
      reviewSrc,
      cuisine,
      price,
    });
    setIsWishlist(newState);
  };

  const handleDelete = async (id: string) => {
    if (user && user.uid === userId) {
      try {
        await remove(ref(db, `posts/${id}`));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleFollowClick = async () => {
    if (!user || !postUser || user.uid === userId) return;

    const senderId = user.uid;
    const receiverId = userId;

    const requestRef = ref(db, `tastemateRequests/${receiverId}/${senderId}`);
    const requestSnap = await get(requestRef);

    if (followStatus === 'accepted') {
      // Already connected — maybe no action or toast
      return;
    }

    if (followStatus === 'pending') {
      // Unsend the pending request
      await remove(requestRef);
      setFollowStatus('none');
      return;
    }

    // Send a new request
    const receiverSnap = await get(ref(db, `users/${receiverId}`));
    if (!receiverSnap.exists()) return;

    const receiverPhotoSnap = await get(
      ref(db, `users/${receiverId}/preferences/photoURL`),
    );
    const receiverPhoto = receiverPhotoSnap.exists()
      ? receiverPhotoSnap.val()
      : '/assets/profile.svg';

    const senderPrefsSnap = await get(ref(db, `users/${senderId}/preferences`));
    const senderPrefs = senderPrefsSnap.exists() ? senderPrefsSnap.val() : {};

    await set(requestRef, {
      senderId,
      senderName: user.displayName,
      senderPhoto: user.photoURL || '/assets/profile.svg',
      senderCuisine: senderPrefs.cuisines || [],
      senderPrice: {
        min: senderPrefs.minPrice ?? 0,
        max: senderPrefs.maxPrice ?? 100,
      },
      receiverId,
      receiverName: postUser,
      receiverPhoto,
      status: 'pending',
      timestamp: Date.now(),
    });
    setFollowStatus('pending');
  };

  return (
    <div className="Card">
      <div className="card-container">
        {isFeed && (
          <div className="post-box">
            <div className="poster-box">
              <div className="poster-profile">
                <img className="profile-pic" src={profileImg} alt="poster profile pic" />
                <h3>{postUser}</h3>
              </div>
              {userId != user?.uid && (
                <input
                  onClick={handleFollowClick}
                  type="image"
                  src={
                    followStatus === 'pending'
                      ? '/assets/following.svg'
                      : followStatus === 'accepted'
                        ? '/assets/following.svg'
                        : '/assets/add-user.svg'
                  }
                  className={followStatus === 'accepted' ? 'accepted-request' : ''}
                  alt="add user icon"
                />
              )}
            </div>
            <p className="caption">{caption}</p>
            {timestamp && (
              <p className="timestamp">
                {new Date(timestamp).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
            <img className="restaurant-pic" src={imgSrc} alt="restaurant img" />
          </div>
        )}
        <div className="name-box">
          <h1>{restaurantName}</h1>
          <input
            onClick={handleWishlistClick}
            type="image"
            src={isWishlist ? '/assets/wishlisted.svg' : '/assets/heart.svg'}
            alt="heart"
          />
        </div>
        <div className="review-box">
          <div className="rating-box">
            <h3>{rating}</h3>
            <h3>{'🍲'.repeat(Math.round(rating))}</h3>
          </div>
          <a href={reviewSrc}>Yelp Reviews</a>
        </div>
        <div className="tags-box">
          <div className="tags">{cuisine}</div>
          <div className="tags">{price}</div>
        </div>
        <div className="other-profiles-box">
          <div className="profiles-box">
            <div className="who-else-pics">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="who-else-box">
              <p className="see-who-text">
                See who <br /> else might want to go
              </p>
              {isOpen && <div className="backdrop"></div>}
              <dialog open={isOpen}>
                <div className="close-button">
                  <input
                    type="image"
                    src="/assets/x.svg"
                    alt="close"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div className="connect-scroll">
                  <ConnectCard
                    isDown={true}
                    profileImg="/assets/profile2.svg"
                    user="Ana"
                    restaurantName={restaurantName}
                    phone="773-688-0000"
                  />
                  <ConnectCard
                    isDown={false}
                    profileImg="/assets/profile2.svg"
                    user="Nikky"
                    restaurantName={restaurantName}
                  />
                  <ConnectCard
                    isDown={false}
                    profileImg="/assets/profile2.svg"
                    user="Marissa"
                    restaurantName={restaurantName}
                  />
                  <ConnectCard
                    isDown={false}
                    profileImg="/assets/profile2.svg"
                    user="Daniel"
                    restaurantName={restaurantName}
                  />
                  <ConnectCard
                    isDown={false}
                    profileImg="/assets/profile2.svg"
                    user="Laura"
                    restaurantName={restaurantName}
                  />
                </div>
              </dialog>
              <input
                type="image"
                src="/assets/arrow.svg"
                alt="arrow"
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </div>
        {isFeed && user?.uid === userId && postId && (
          <button className="delete-button" onClick={() => handleDelete(postId)}>
            Delete Post
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
