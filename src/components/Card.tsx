import './Card.css';

const Card = () => {
  return (
    <div>
      <img src="src/assets/pizza.png" alt="restaurant img"></img>
      <div className="name-box">
        <h1>Primos</h1>
        <img src="src/assets/heart.svg" alt="heart"></img>
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
        <div>cuisine</div>
        <div>price</div>
      </div>
      <div className="profiles-box">
        <div>
          <div>profile pics</div>
          <div>
            <p>See who else might want to go</p>
            <div>arrow</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
