import './ConnectCard.css';

import { getAuth } from 'firebase/auth';
import { get, getDatabase, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';

interface ConnectCardProps {
  profileImg: string;
  user: string;
  restaurantName: string;
  phone?: string;
  email: string;
  currentUserId: string;
  targetUserId: string;
}

const ConnectCard: React.FC<ConnectCardProps> = ({
  profileImg,
  user,
  restaurantName,
  phone,
  email,
  currentUserId,
  targetUserId,
}) => {
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted'>(
    'none',
  );

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!currentUserId || !targetUserId) return;

      const db = getDatabase();
      const requestRef = ref(db, `tastemateRequests/${targetUserId}/${currentUserId}`);
      const requestSnap = await get(requestRef);

      if (!requestSnap.exists()) {
        setFollowStatus('none');
        return;
      }

      const status = requestSnap.val().status;
      if (status === 'pending') setFollowStatus('pending');
      else if (status === 'accepted') setFollowStatus('accepted');
    };

    checkFollowStatus();
  }, [currentUserId, targetUserId]);

  const handleFollowClick = async () => {
    if (!currentUserId || !targetUserId) return;

    const db = getDatabase();
    const requestRef = ref(db, `tastemateRequests/${targetUserId}/${currentUserId}`);
    const requestSnap = await get(requestRef);

    if (followStatus === 'accepted') return;

    if (followStatus === 'pending') {
      await remove(requestRef);
      setFollowStatus('none');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    const senderPrefsSnap = await get(ref(db, `users/${currentUserId}/preferences`));
    const senderPrefs = senderPrefsSnap.exists() ? senderPrefsSnap.val() : {};

    const receiverSnap = await get(ref(db, `users/${targetUserId}`));
    const receiverName = receiverSnap.val()?.preferences?.displayName || 'Unknown';
    const receiverPhoto =
      receiverSnap.val()?.preferences?.photoURL || '/assets/profile.svg';

    await set(requestRef, {
      senderId: currentUserId,
      senderName: user?.displayName || '',
      senderPhoto: user?.photoURL || '/assets/profile.svg',
      senderCuisine: senderPrefs.cuisines || [],
      senderPrice: {
        min: senderPrefs.minPrice ?? 0,
        max: senderPrefs.maxPrice ?? 100,
      },
      receiverId: targetUserId,
      receiverName,
      receiverPhoto,
      status: 'pending',
      timestamp: Date.now(),
    });

    setFollowStatus('pending');
  };

  return (
    <div className="ConnectCard">
      <img className="connect-pic" src={profileImg} alt="profile pic"></img>
      <>
        <p>
          {user} wants to go to {restaurantName}!
        </p>
        <input
          onClick={() => handleFollowClick}
          type="image"
          src={
            followStatus === 'pending'
              ? '/assets/following.svg'
              : followStatus === 'accepted'
                ? '/assets/following.svg'
                : '/assets/add-user.svg'
          }
          className={followStatus === 'accepted' ? 'accepted-request' : ''}
          alt="add user"
        />
      </>
    </div>
  );
};

export default ConnectCard;
