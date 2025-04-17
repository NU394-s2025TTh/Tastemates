import './Card.css';

import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { ChevronRight } from 'lucide-react';
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
  userId?: string;
  postId?: string;
}

interface Wishlister {
  uid: string;
  photoURL: string;
  displayName: string;
  phoneNumber?: string;
  email: string;
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
  const [wishlisters, setWishlisters] = useState<Wishlister[]>([]);
  const [loadingWishlisters, setLoadingWishlisters] = useState(true);

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
    const fetchWishlisters = async () => {
      const db = getDatabase();

      try {
        const snapshot = await get(ref(db, 'wishlists'));
        if (snapshot.exists()) {
          const allWishlists = snapshot.val() as Record<string, Record<string, any>>;

          const matchingUsers = Object.entries(allWishlists)
            .filter(([_, wishlist]) => {
              if (!wishlist) return false;
              return Object.keys(wishlist).some(
                (key) => key.toLowerCase().trim() === restaurantName.toLowerCase().trim(),
              );
            })
            .map(([uid, wishlist]) => {
              const restaurantKey = Object.keys(wishlist).find(
                (key) => key.toLowerCase().trim() === restaurantName.toLowerCase().trim(),
              );
              return restaurantKey ? uid : null;
            })
            .filter(Boolean) as string[];

          const userDataPromises = matchingUsers.map(async (uid) => {
            const prefsSnap = await get(ref(db, `users/${uid}/preferences`));
            const prefs = prefsSnap.exists() ? prefsSnap.val() : {};
            return {
              uid,
              photoURL: prefs.photoURL || '/assets/profile.svg',
              displayName: prefs.displayName || 'Anonymous',
              phoneNumber: prefs.phoneNumber || '',
              email: prefs.email || '',
            };
          });

          const usersData = await Promise.all(userDataPromises);

          // Filter out the current user from the wishlisters
          const filteredUsersData = usersData.filter(
            (userData) => userData.uid !== user?.uid,
          );

          setWishlisters(filteredUsersData);
        } else {
          setWishlisters([]);
        }
      } catch (error) {
        console.error('Error fetching wishlisters:', error);
        setWishlisters([]);
      } finally {
        setLoadingWishlisters(false);
      }
    };

    fetchWishlisters();
  }, [restaurantName, user?.uid]); // Added user?.uid as dependency to ensure correct filtering

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !postUser || user.uid === userId) return;

      const dbRef = getDatabase();

      const receiverViewRef = ref(dbRef, `tastemateRequests/${userId}/${user.uid}`);
      const senderViewRef = ref(dbRef, `tastemateRequests/${user.uid}/${userId}`);

      const [receiverSnap, senderSnap] = await Promise.all([
        get(receiverViewRef),
        get(senderViewRef),
      ]);

      const receiverStatus = receiverSnap.exists() ? receiverSnap.val().status : null;
      const senderStatus = senderSnap.exists() ? senderSnap.val().status : null;

      if (receiverStatus === 'accepted' || senderStatus === 'accepted') {
        setFollowStatus('accepted');
      } else if (receiverStatus === 'pending') {
        setFollowStatus('pending');
      } else {
        setFollowStatus('none');
      }
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
                        ? '/assets/friends.svg'
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
          <a href={reviewSrc} target="_blank" rel="noreferrer">
            Yelp Reviews
          </a>
        </div>
        <div className="tags-box">
          <div className="tags">{cuisine}</div>
          <div className="tags">{price}</div>
        </div>
        <div className="profiles-box">
          <div className="who-else-pics">
            {wishlisters.length > 0
              ? wishlisters
                  .slice(0, 3)
                  .map((user, idx) => (
                    <img key={idx} src={user.photoURL} alt={user.displayName} />
                  ))
              : ''}
          </div>
          <div className="who-else-box">
            {wishlisters.length > 0 ? (
              <button className="see-who-wrapper" onClick={() => setIsOpen(true)}>
                <p className="see-who-text">
                  See who else might <br /> want to go
                  <ChevronRight className="arrow-icon" size={24} />
                </p>
              </button>
            ) : (
              <p className="see-who-text">
                Nobody else has wishlisted this <br /> restaurant yet.
              </p>
            )}
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
                <p className="see-who-headline">
                  These users want to go to {restaurantName}:
                </p>
                {wishlisters.map((w) => (
                  <ConnectCard
                    key={w.uid}
                    profileImg={w.photoURL}
                    user={w.displayName}
                    restaurantName={restaurantName}
                    phone={w.phoneNumber}
                    email={w.email}
                    currentUserId={user!.uid}
                    targetUserId={w.uid}
                  />
                ))}
              </div>
            </dialog>
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
