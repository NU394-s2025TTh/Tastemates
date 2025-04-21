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
    // Firebase: check if a tastemate request has been sent or accepted
    const checkFollowStatus = async () => {
      if (!currentUserId || !targetUserId) return;

      const db = getDatabase();
      const sentRef = ref(db, `sentTastemateRequests/${currentUserId}/${targetUserId}`);
      const receivedRef = ref(
        db,
        `receivedTastemateRequests/${currentUserId}/${targetUserId}`,
      );

      const [sentSnap, receivedSnap] = await Promise.all([
        get(sentRef),
        get(receivedRef),
      ]);

      const sentStatus = sentSnap.exists() ? sentSnap.val().status : null;
      const receivedStatus = receivedSnap.exists() ? receivedSnap.val().status : null;

      if (sentStatus === 'accepted' || receivedStatus === 'accepted') {
        setFollowStatus('accepted');
      } else if (sentStatus === 'pending' || receivedStatus === 'pending') {
        setFollowStatus('pending');
      } else {
        setFollowStatus('none');
      }
    };

    checkFollowStatus();
  }, [currentUserId, targetUserId]);

  const handleFollowClick = async () => {
    if (!currentUserId || !targetUserId) return;

    const db = getDatabase();
    const sentRef = ref(db, `sentTastemateRequests/${currentUserId}/${targetUserId}`);
    const receivedRef = ref(
      db,
      `receivedTastemateRequests/${targetUserId}/${currentUserId}`,
    );

    if (followStatus === 'accepted') return;

    if (followStatus === 'pending') {
      // Firebase: cancel the pending request
      await Promise.all([remove(sentRef), remove(receivedRef)]);
      setFollowStatus('none');
      return;
    }

    // Firebase: send a new tastemate request
    const senderPrefsSnap = await get(ref(db, `users/${currentUserId}/preferences`));
    const senderPrefs = senderPrefsSnap.exists() ? senderPrefsSnap.val() : {};

    const receiverPrefsSnap = await get(ref(db, `users/${targetUserId}/preferences`));
    const receiverPrefs = receiverPrefsSnap.exists() ? receiverPrefsSnap.val() : {};

    const auth = getAuth();
    const user = auth.currentUser;

    const requestData = {
      senderId: currentUserId,
      senderName: user?.displayName || '',
      senderPhoto: user?.photoURL || '/assets/profile.svg',
      senderCuisine: senderPrefs.cuisines || [],
      senderPrice: {
        min: senderPrefs.minPrice ?? 0,
        max: senderPrefs.maxPrice ?? 100,
      },
      receiverId: targetUserId,
      receiverName: receiverPrefs.displayName || 'User',
      receiverPhoto: receiverPrefs.photoURL || '/assets/profile.svg',
      status: 'pending',
    };

    await Promise.all([set(sentRef, requestData), set(receivedRef, requestData)]);

    setFollowStatus('pending');
  };

  return (
    <div className="ConnectCard">
      <img className="connect-pic" src={profileImg} alt="profile pic"></img>
      <div>
        <p className="wants-to-go">
          {user} wants to go to {restaurantName}!
        </p>
        {followStatus === 'accepted' && (
          <p className="contact-info">
            {phone && phone.trim() !== ''
              ? `Text them at ${phone}`
              : `Email them at ${email}`}
          </p>
        )}
      </div>
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
        alt="add user"
      />
    </div>
  );
};

export default ConnectCard;
