import './ConnectCard.css';

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
          <input type="image" src="src/assets/add-user-outline.svg" alt="add user" />
        </>
      )}
    </div>
  );
};

export default ConnectCard;
