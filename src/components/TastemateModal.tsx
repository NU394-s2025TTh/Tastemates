import './TastemateModal.css';

import { get, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';

// import { auth } from 'firebase-admin';
import { auth, db } from '../firebase';

interface TMProps {
  tastemate: any;
  onClose: () => void;
  // show tastemate add/pending/accepted status
  showRequest?: boolean;
}
// copy of handling follow

// logged in user
// const currUser = auth.currentUser;
// const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted'>('none');

const TastemateModal = ({ tastemate, onClose, showRequest = false }: TMProps) => {
  if (!tastemate) return null;

  const user = auth.currentUser;
  const [followStatus, setFollowStatus] = useState<'none' | 'pending' | 'accepted'>(
    'none',
  );

  /* ---------- check current relationship on mount ------------------ */
  useEffect(() => {
    if (!user || user.uid === tastemate.uid) return;

    const sent = ref(db, `sentTastemateRequests/${user.uid}/${tastemate.uid}`);
    const rec = ref(db, `receivedTastemateRequests/${user.uid}/${tastemate.uid}`);

    Promise.all([get(sent), get(rec)]).then(([s, r]) => {
      const st = (s.exists() && s.val().status) || (r.exists() && r.val().status);
      setFollowStatus(st ?? 'none');
    });
  }, [user, tastemate.uid]);

  const handleFollowClick = async () => {
    const user = auth.currentUser;
    if (!user || user.uid === tastemate.uid) return;

    const senderUid = user.uid;
    const receiverUid = tastemate.uid;

    const sentRef = ref(db, `sentTastemateRequests/${senderUid}/${receiverUid}`);
    const receivedRef = ref(db, `receivedTastemateRequests/${receiverUid}/${senderUid}`);

    //   if already tastemates
    if (followStatus === 'accepted') return;

    // if pending, remove
    if (followStatus === 'pending') {
      await Promise.all([remove(sentRef), remove(receivedRef)]);
      setFollowStatus('none');
    }
    //if none, put to pending
    const [senderSnap, receiverSnap] = await Promise.all([
      get(ref(db, `users/${senderUid}/preferences`)),
      get(ref(db, `users/${receiverUid}/preferences`)),
    ]);

    const senderPrefs = senderSnap.exists() ? senderSnap.val() : {};
    const receiverPrefs = receiverSnap.exists() ? receiverSnap.val() : {};

    const data = {
      senderUid,
      senderName: user.displayName || 'Anonymous',
      senderPhoto: user.photoURL || 'assets/profile.svg',
      senderCuisine: senderPrefs.cuisines || [],
      senderPrice: { min: senderPrefs.minPrice ?? 0, max: senderPrefs.maxPrice ?? 100 },
      receiverUid,
      receiverName: tastemate.name || 'Anonymous',
      receiverPhoto: receiverPrefs.photoURL || 'assets/profile.svg',
      status: 'pending',
    };
    if (followStatus === 'pending') {
      await Promise.all([remove(sentRef), remove(receivedRef)]);
      setFollowStatus('none');
      return;
    }

    await Promise.all([set(sentRef, data), set(receivedRef, data)]);
    setFollowStatus('pending');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <img src={tastemate.photoURL} alt="Profile" className="modal-pic" />
        <h2>{tastemate.displayName}</h2>

        {/* render add tastemate button when */}
        {showRequest && user?.uid !== tastemate.uid && (
          <input
            type="image"
            onClick={handleFollowClick}
            src={
              followStatus === 'pending'
                ? '/assets/following.svg'
                : followStatus === 'accepted'
                  ? '/assets/friends.svg'
                  : '/assets/add-user.svg'
            }
            className={followStatus === 'accepted' ? 'accepted-request' : ''}
            alt="tastemate button"
            style={{ position: 'absolute', top: '1rem', right: '1rem' }}
          />
        )}
        <div className="contact-centered">
          <p className="contact-centered-email">
            <strong>Email:</strong> {tastemate.email}
          </p>
          {tastemate.phoneNumber && (
            <p className="contact-centered-phone">
              <strong>Phone: </strong>
              {tastemate.phoneNumber}
            </p>
          )}
        </div>

        <h3 className="fav-cuisines">Favorite Cuisines</h3>
        <div className="modal-cuisines">
          {tastemate.cuisines?.length ? (
            tastemate.cuisines.map((c: string) => (
              <p className="cuisine-tag" key={c}>
                {c}
              </p>
            ))
          ) : (
            <p>No cuisines listed</p>
          )}
        </div>

        <h3>Price Range</h3>
        <p className="contact-centered">
          ${tastemate.minPrice ?? 0} - ${tastemate.maxPrice ?? 100},
        </p>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TastemateModal;
