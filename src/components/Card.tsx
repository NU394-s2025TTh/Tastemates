import './Card.css';

const Card = () => {
  return (
    <div>
      <img
        className="restaurant-pic"
        src="src/assets/pizza.png"
        alt="restaurant img"
      ></img>
      <div className="name-box">
        <h1>Primos</h1>
        <input type="image" src="src/assets/heart.svg" alt="heart" />
      </div>
      <div className="review-box">
        <div className="rating-box">
          <p>4.5</p>
          <p>🍲🍲🍲🍲</p>
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
