import './ConnectCard.css';

interface ConnectCardProps {
  isDown: boolean;
}

const ConnectCard: React.FC<ConnectCardProps> = ({ isDown }) => {
  return (
    <div className="ConnectCard">
      <img src="src/assets/profile2.svg" alt="profile pic"></img>
      {isDown ? (
        <>
          <p>
            Pedro is down to go <br></br>to Shang&apos;s with you!
          </p>
          <p>773-688-0000</p>
        </>
      ) : (
        <>
          <p>Pedro wants to go to Shang&apos;s!</p>
          <input type="image" src="src/assets/add-user-outline.svg" alt="add user" />
        </>
      )}
    </div>
  );
};

export default ConnectCard;
