import './InvitationsPage.css';

import { get, onValue, ref, remove, set } from 'firebase/database';
import { Check, ChevronLeft, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { auth, db } from '../firebase';
import Navbar from './Navbar';

interface TastemateRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderPhoto: string;
  senderCuisine: string[];
  senderPrice: { min: number; max: number };
  receiverId: string;
  receiverName: string;
  receiverPhoto: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface InvitationsPageProps {
  onBack: () => void;
}

const InvitationsPage: React.FC<InvitationsPageProps> = ({ onBack }) => {
  const [receivedRequests, setReceivedRequests] = useState<TastemateRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<TastemateRequest[]>([]);
  const [followStatuses, setFollowStatuses] = useState<
    Record<string, 'none' | 'pending' | 'accepted'>
  >({});

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const requestsRef = ref(db, 'tastemateRequests');
    onValue(
      requestsRef,
      (snapshot) => {
        const data = snapshot.val();
        const received: TastemateRequest[] = [];
        const sent: TastemateRequest[] = [];
        const statuses: Record<string, 'none' | 'pending' | 'accepted'> = {};

        if (!data) return;

        for (const receiverId in data) {
          for (const senderId in data[receiverId]) {
            const request = data[receiverId][senderId];
            const id = `${receiverId}_${senderId}`;

            if (request.receiverId === user.uid && request.status === 'pending') {
              received.push({ id, ...request });
            } else if (request.senderId === user.uid) {
              if (request.status === 'declined') {
                remove(ref(db, `tastemateRequests/${receiverId}/${senderId}`));
              } else {
                sent.push({ id, ...request });
                statuses[id] = request.status;
              }
            }
          }
        }

        setReceivedRequests(received);
        setSentRequests(sent);
        setFollowStatuses(statuses);
      },
      (error) => {
        console.error('Error fetching requests:', error);
      },
    );
  }, [user]);

  const handleFollowClick = async (
    receiverId: string,
    requestId: string,
    receiverName: string,
  ) => {
    if (!user) return;

    const senderId = user.uid;
    const requestRef = ref(db, `tastemateRequests/${receiverId}/${senderId}`);
    const status = followStatuses[requestId];

    if (status === 'accepted') return;

    if (status === 'pending') {
      await remove(requestRef);
      setFollowStatuses((prev) => ({ ...prev, [requestId]: 'none' }));
      setSentRequests((prev) => prev.filter((req) => req.id !== requestId));
      return;
    }

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
      receiverName,
      receiverPhoto,
      status: 'pending',
      timestamp: Date.now(),
    });

    setFollowStatuses((prev) => ({ ...prev, [requestId]: 'pending' }));
  };

  return (
    <div className="invitations-page">
      <Navbar />
      <button className="back-container" onClick={onBack}>
        <ChevronLeft className="back-button" size={30} strokeWidth={2.5} />
        <h1 className="back-title">Back To Feed</h1>
      </button>

      <h2 className="first-header">Received Requests</h2>
      {receivedRequests.length > 0 ? (
        receivedRequests.map((req) => (
          <div key={req.id} className="request-card">
            <img src={req.senderPhoto} alt={req.senderName} className="request-photo" />
            <div className="request-info">
              <p className="request-info-name">{req.senderName}</p>
              <p className="request-info-sub">
                Price Range: ${req.senderPrice.min} - ${req.senderPrice.max}
              </p>
              <p className="request-info-sub">
                Favorite Cuisines: {req.senderCuisine.join(', ')}
              </p>
            </div>
            <div className="button-row">
              <button className="accept-button" title="Accept">
                <Check strokeWidth={2.5} />
              </button>
              <button className="decline-button" title="Decline">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No received requests</p>
      )}

      <h2 className="second-header">Sent Requests</h2>
      {sentRequests.length > 0 ? (
        sentRequests.map((req) => (
          <div key={req.id} className="request-card">
            <img
              src={req.receiverPhoto}
              alt={req.receiverName}
              className="request-photo"
            />
            <div className="request-info">
              <p className="request-info-name">{req.receiverName}</p>
              <p className="request-info-sub">Sent request - {req.status}</p>
            </div>
            <div className="follow-button-wrapper">
              <input
                onClick={() =>
                  handleFollowClick(req.receiverId, req.id, req.receiverName)
                }
                type="image"
                src={
                  followStatuses[req.id] === 'pending'
                    ? '/assets/following.svg'
                    : followStatuses[req.id] === 'accepted'
                      ? '/assets/following.svg'
                      : '/assets/add-user.svg'
                }
                className={
                  followStatuses[req.id] === 'accepted' ? 'accepted-request' : ''
                }
                alt="add user icon"
              />
            </div>
          </div>
        ))
      ) : (
        <p>No sent requests</p>
      )}
    </div>
  );
};

export default InvitationsPage;
