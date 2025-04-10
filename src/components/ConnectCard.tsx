import './ConnectCard.css';

import { useState } from 'react';

interface ConnectCardProps {
  isDown: boolean;
  profileImg: string;
  user: string;
  restaurantName: string;
  phone?: string;
}

const ConnectCard: React.FC<ConnectCardProps> = ({
  isDown,
  profileImg,
  user,
  restaurantName,
  phone,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  return (
    <div className="ConnectCard">
      <img src={profileImg} alt="profile pic"></img>
      {isDown ? (
        <>
          <p>
            {user} is down to go <br></br>to {restaurantName} with you!
          </p>
          <p>{phone}</p>
        </>
      ) : (
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
      )}
    </div>
  );
};

export default ConnectCard;
