import './UserCard.css';

import { Info } from 'lucide-react';
import React from 'react';

interface UserCardProps {
  user: {
    uid: string;
    displayName: string;
    photoURL: string;
  };
  //called when the user card is clicked
  onOpen?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onOpen }) => (
  <div
    className="user-card"
    role={onOpen ? 'button' : undefined}
    tabIndex={onOpen ? 0 : undefined}
    onClick={onOpen}
    onKeyDown={(e) => {
      if (!onOpen) return;
      if (e.key === 'Enter' || e.key === ' ') onOpen();
    }}
  >
    <img
      className="user-profile-pic"
      src={user.photoURL || '/assets/profile.svg'}
      alt={user.displayName}
      loading="lazy"
    />
    <div className="user-name">{user.displayName || 'User'}</div>

    {/* implement info icon  */}
    {onOpen && (
      <Info
        size={20}
        className="view-details-button"
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
      />
    )}
  </div>
);

export default UserCard;
