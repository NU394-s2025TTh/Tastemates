import './InvitationsPage.css';

import { get, onValue, ref, remove, set, update } from 'firebase/database';
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

interface UserProfile {
  uid: string;
  displayName: string;
  photoURL: string;
  isUserSender: boolean;
}

interface InvitationsPageProps {
  onBack: () => void;
}

const InvitationsPage: React.FC<InvitationsPageProps> = ({ onBack }) => {
  const [receivedRequests, setReceivedRequests] = useState<TastemateRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<TastemateRequest[]>([]);
  const [tastemates, setTastemates] = useState<UserProfile[]>([]);
  const [followStatuses, setFollowStatuses] = useState<
    Record<string, 'none' | 'pending' | 'accepted'>
  >({});

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Firebase: fetch received tastemate requests
    const receivedRef = ref(db, `receivedTastemateRequests/${user.uid}`);
    const sentRef = ref(db, `sentTastemateRequests/${user.uid}`);
    const tastematesRef = ref(db, `tastemates/${user.uid}`);

    const unsubscribeReceived = onValue(receivedRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formatted: TastemateRequest[] = Object.entries(data)
        .map(([senderId, request]: any) => ({
          id: `${user.uid}_${senderId}`,
          ...request,
        }))
        .filter((req) => req.status === 'pending'); // Only keep pending
      setReceivedRequests(formatted);
    });

    // Firebase: fetch sent tastemate requests
    const unsubscribeSent = onValue(sentRef, (snapshot) => {
      const data = snapshot.val() || {};
      const formatted: TastemateRequest[] = Object.entries(data)
        .map(([receiverId, request]: any) => ({
          id: `${receiverId}_${user.uid}`,
          ...request,
        }))
        .filter((req) => req.status === 'pending'); // Only keep pending
      const statuses: Record<string, 'none' | 'pending' | 'accepted'> = {};
      formatted.forEach((req) => {
        const status = req.status === 'declined' ? 'none' : req.status;
        statuses[req.id] = status;
      });
      setSentRequests(formatted);
      setFollowStatuses(statuses);
    });

    // Firebase: fetch confirmed tastemates and their preferences
    const unsubscribeTastemates = onValue(tastematesRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const ids = Object.keys(data);
      const mates = await Promise.all(
        ids.map(async (uid) => {
          const snap = await get(ref(db, `users/${uid}/preferences`));
          const prefs = snap.exists() ? snap.val() : {};
          return {
            uid,
            displayName: prefs.displayName || 'User',
            photoURL: prefs.photoURL || '/assets/profile.svg',
            isUserSender: true,
          };
        }),
      );
      setTastemates(mates);
    });

    return () => {
      unsubscribeReceived();
      unsubscribeSent();
      unsubscribeTastemates();
    };
  }, [user]);

  // Firebase: send or cancel a request
  const handleFollowClick = async (
    receiverId: string,
    requestId: string,
    receiverName: string,
  ) => {
    if (!user) return;

    const senderId = user.uid;
    const sentRef = ref(db, `sentTastemateRequests/${senderId}/${receiverId}`);
    const receivedRef = ref(db, `receivedTastemateRequests/${receiverId}/${senderId}`);
    const status = followStatuses[requestId];

    if (status === 'accepted') return;

    if (status === 'pending') {
      // Firebase: cancel request
      await Promise.all([remove(sentRef), remove(receivedRef)]);
      setFollowStatuses((prev) => ({ ...prev, [requestId]: 'none' }));
      setSentRequests((prev) => prev.filter((req) => req.id !== requestId));
      return;
    }

    const receiverSnap = await get(ref(db, `users/${receiverId}/preferences`));
    const receiverPrefs = receiverSnap.exists() ? receiverSnap.val() : {};

    const senderSnap = await get(ref(db, `users/${senderId}/preferences`));
    const senderPrefs = senderSnap.exists() ? senderSnap.val() : {};

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
      receiverName,
      receiverPhoto: receiverPrefs.photoURL || '/assets/profile.svg',
      status: 'pending',
    };

    // Firebase: send request to both sent and received paths
    await Promise.all([set(sentRef, requestData), set(receivedRef, requestData)]);

    setFollowStatuses((prev) => ({ ...prev, [requestId]: 'pending' }));
  };

  // Firebase: accept a tastemate request
  const handleAcceptRequest = async (receiverId: string, senderId: string) => {
    const requestSnap = await get(
      ref(db, `receivedTastemateRequests/${receiverId}/${senderId}`),
    );
    const request = requestSnap.exists() ? requestSnap.val() : null;
    if (!request) return;

    await Promise.all([
      update(ref(db, `receivedTastemateRequests/${receiverId}/${senderId}`), {
        status: 'accepted',
      }),
      update(ref(db, `sentTastemateRequests/${senderId}/${receiverId}`), {
        status: 'accepted',
      }),
      set(ref(db, `tastemates/${receiverId}/${senderId}`), true),
      set(ref(db, `tastemates/${senderId}/${receiverId}`), true),
    ]);

    setReceivedRequests((prev) =>
      prev.filter((req) => !(req.receiverId === receiverId && req.senderId === senderId)),
    );
  };

  // Firebase: decline a tastemate request (removes both entries)
  const handleDeclineRequest = async (receiverId: string, senderId: string) => {
    await Promise.all([
      remove(ref(db, `receivedTastemateRequests/${receiverId}/${senderId}`)),
      remove(ref(db, `sentTastemateRequests/${senderId}/${receiverId}`)),
    ]);

    setReceivedRequests((prev) =>
      prev.filter((req) => !(req.receiverId === receiverId && req.senderId === senderId)),
    );
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
              <button
                className="accept-button"
                title="Accept"
                onClick={() => handleAcceptRequest(req.receiverId, req.senderId)}
              >
                <Check strokeWidth={2.5} />
              </button>
              <button
                className="decline-button"
                title="Decline"
                onClick={() => handleDeclineRequest(req.receiverId, req.senderId)}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No pending requests</p>
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
        <p>No pending requests</p>
      )}

      <h2 className="second-header">Tastemates</h2>
      {tastemates.length > 0 ? (
        tastemates.map((mate) => (
          <div key={mate.uid} className="request-card">
            <img src={mate.photoURL} alt={mate.displayName} className="request-photo" />
            <div className="request-info">
              <p className="request-info-name">{mate.displayName}</p>
              <p className="request-info-sub">You&apos;re connected!</p>
            </div>
            <div className="follow-button-wrapper">
              <input
                type="image"
                src="/assets/friends.svg"
                className="accepted-request"
                alt="add user icon"
              />
            </div>
          </div>
        ))
      ) : (
        <p>No tastemates yet</p>
      )}
    </div>
  );
};

export default InvitationsPage;
