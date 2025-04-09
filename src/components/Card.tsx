import './Card.css';

interface CardProps {
  isFeed: boolean;
}

const Card: React.FC<CardProps> = ({ isFeed }) => {
  return (
    <div className="Card">
      {isFeed && (
        <div className="post-box">
          <div className="poster-box">
            <div className="poster-profile">
              <img src="src/assets/poster-pic.svg" alt="poster profile pic"></img>
              <h3>Rachel</h3>
            </div>
            <input type="image" src="src/assets/add-user.svg" alt="add user icon" />
          </div>
          <p>Primos was SOOOOO good. Who&apos;s down to go again next week?</p>
          <img
            className="restaurant-pic"
            src="src/assets/pizza.png"
            alt="restaurant img"
          ></img>
        </div>
      )}
      <div className="name-box">
        <h1>Primos</h1>
        <input type="image" src="src/assets/heart.svg" alt="heart" />
      </div>
      <div className="review-box">
        <div className="rating-box">
          <h3>4.5</h3>
          <h3>🍲🍲🍲🍲</h3>
        </div>
        {/* stars */}
        <a href="https://g.co/kgs/st6SdLx">Google Reviews</a>
      </div>
      <div className="tags-box">
        <div className="tags">Italian</div>
        <div className="tags">$</div>
      </div>
      <div className="other-profiles-box">
        <div className="profiles-box">
          <div className="circle"></div>
          <div className="who-else-box">
            <p>
              See who <br></br> else might want to go
            </p>
            <input type="image" src="src/assets/arrow.svg" alt="arrow" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
