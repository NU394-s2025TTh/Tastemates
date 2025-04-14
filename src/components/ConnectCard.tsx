import './ConnectCard.css';

import { useState } from 'react';

interface ConnectCardProps {
  profileImg: string;
  user: string;
  restaurantName: string;
  phone?: string;
}

const ConnectCard: React.FC<ConnectCardProps> = ({
  profileImg,
  user,
  restaurantName,
  phone,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <div className="ConnectCard">
      <img className="connect-pic" src={profileImg} alt="profile pic"></img>
      <>
        <p>
          {user} wants to go to {restaurantName}!
        </p>
        <input
          onClick={() => setIsFollowing(!isFollowing)}
          type="image"
          src={isFollowing ? '/assets/following.svg' : '/assets/add-user.svg'}
          alt="add user"
        />
      </>
    </div>
  );
};

export default ConnectCard;
