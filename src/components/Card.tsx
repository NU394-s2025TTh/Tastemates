import './Card.css';

import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { Bookmark, ChevronRight } from 'lucide-react';
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
  price?: string;
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

const Card: React.FC<CardProps> = ({ ...props }) => {
  const {
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
  } = props;

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
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  // Firebase: check if the current user has wishlisted this restaurant
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
    // Firebase: fetch other users who have wishlisted this restaurant
    const fetchWishlisters = async () => {
      setLoadingWishlisters(true);
      try {
        const snapshot = await get(ref(db, `wishlistsByRestaurant/${restaurantName}`));
        if (!snapshot.exists()) {
          setWishlisters([]);
          return;
        }

        const data = snapshot.val();
        const users: Wishlister[] = Object.entries(data)
          .map(([uid, info]: any) => ({
            uid,
            photoURL: info.photoURL || '/assets/profile.svg',
            displayName: info.displayName || 'Anonymous',
            email: info.email || '',
            phoneNumber: info.phoneNumber || '',
          }))
          .filter((u) => u.uid !== user?.uid); // filter out current user

        setWishlisters(users);
      } catch (error) {
        console.error('Error fetching wishlisters:', error);
        setWishlisters([]);
      } finally {
        setLoadingWishlisters(false);
      }
    };

    fetchWishlisters();
  }, [restaurantName, user?.uid]);

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user || !postUser || user.uid === userId) return;

      const dbRef = getDatabase();
      const receivedRef = ref(dbRef, `receivedTastemateRequests/${user.uid}/${userId}`);
      const sentRef = ref(dbRef, `sentTastemateRequests/${user.uid}/${userId}`);

      const [receivedSnap, sentSnap] = await Promise.all([
        get(receivedRef),
        get(sentRef),
      ]);

      const receivedStatus = receivedSnap.exists() ? receivedSnap.val().status : null;
      const sentStatus = sentSnap.exists() ? sentSnap.val().status : null;

      if (receivedStatus === 'accepted' || sentStatus === 'accepted') {
        setFollowStatus('accepted');
      } else if (receivedStatus === 'pending' || sentStatus === 'pending') {
        setFollowStatus('pending');
      } else {
        setFollowStatus('none');
      }
    };

    checkFollowStatus();
  }, [user, userId, postUser]);

  const handleWishlistClick = async () => {
    if (!user) return;
    const dbRef = getDatabase();
    const uid = user.uid;

    const userWishlistRef = ref(dbRef, `wishlists/${uid}/${restaurantName}`);
    const restaurantWishlistRef = ref(
      dbRef,
      `wishlistsByRestaurant/${restaurantName}/${uid}`,
    );

    const userPrefsSnap = await get(ref(dbRef, `users/${uid}/preferences`));
    const prefs = userPrefsSnap.exists() ? userPrefsSnap.val() : {};

    if (isWishlist) {
      // Firebase: remove from both user-centric and restaurant-centric wishlist paths
      await Promise.all([remove(userWishlistRef), remove(restaurantWishlistRef)]);
      setIsWishlist(false);
    } else {
      // Firebase: write wishlist to both user and restaurant views

      const data = {
        rating,
        reviewSrc,
        cuisine,
        price: price ?? '$?',
      };
      await Promise.all([
        set(userWishlistRef, data),
        set(restaurantWishlistRef, {
          photoURL: prefs.photoURL || '/assets/profile.svg',
          displayName: prefs.displayName || 'Anonymous',
          email: prefs.email || '',
          phoneNumber: prefs.phoneNumber || '',
        }),
      ]);
      setIsWishlist(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (user?.uid === userId) {
      try {
        await remove(ref(db, `posts/${id}`));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleFollowClick = async () => {
    if (!user || !postUser || user.uid === userId) return;

    const dbRef = getDatabase();
    const senderId = user.uid;
    const receiverId = userId;
    const sentRef = ref(db, `sentTastemateRequests/${senderId}/${receiverId}`);
    const receivedRef = ref(db, `receivedTastemateRequests/${receiverId}/${senderId}`);

    if (followStatus === 'accepted') {
      // Already connected — maybe no action or toast
      return;
    }

    if (followStatus === 'pending') {
      // Unsend the pending request
      await Promise.all([remove(sentRef), remove(receivedRef)]);
      setFollowStatus('none');
      return;
    }

    const senderPrefsSnap = await get(ref(db, `users/${senderId}/preferences`));
    const senderPrefs = senderPrefsSnap.exists() ? senderPrefsSnap.val() : {};

    const receiverPrefsSnap = await get(ref(db, `users/${receiverId}/preferences`));
    const receiverPrefs = receiverPrefsSnap.exists() ? receiverPrefsSnap.val() : {};

    const requestData = {
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
      receiverPhoto: receiverPrefs.photoURL || '/assets/profile.svg',
      status: 'pending',
    };

    await Promise.all([set(sentRef, requestData), set(receivedRef, requestData)]);

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
          <button onClick={handleWishlistClick}>
            <Bookmark
              size={28}
              className={`${isWishlist ? `selected` : ``} wishlist-button`}
            />
          </button>
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
          {price && <div className="tags">{price}</div>}
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
