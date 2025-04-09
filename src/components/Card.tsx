import './Card.css';

import { useState } from 'react';

import ConnectCard from './ConnectCard';

interface CardProps {
  isFeed: boolean;
  profileImg?: string;
  postUser?: string;
  caption?: string;
  imgSrc?: string;
  restaurantName: string;
  rating: number;
  reviewSrc: string;
  cuisine: string;
  price: string;
}

const Card: React.FC<CardProps> = ({
  isFeed,
  profileImg,
  postUser,
  caption,
  imgSrc,
  restaurantName,
  rating,
  reviewSrc,
  cuisine,
  price,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isWishlist, setIsWishlist] = useState(false);

  return (
    <div className="Card">
      {isFeed && (
        <div className="post-box">
          <div className="poster-box">
            <div className="poster-profile">
              <img src={profileImg} alt="poster profile pic"></img>
              <h3>{postUser}</h3>
            </div>
            <input
              onClick={() => setIsFollowing(!isFollowing)}
              type="image"
              src={isFollowing ? 'src/assets/following.svg' : 'src/assets/add-user.svg'}
              alt="add user icon"
            />
          </div>
          <p>{caption}</p>
          <img className="restaurant-pic" src={imgSrc} alt="restaurant img"></img>
        </div>
      )}
      <div className="name-box">
        <h1>{restaurantName}</h1>
        <input
          onClick={() => setIsWishlist(!isWishlist)}
          type="image"
          src={isWishlist ? 'src/assets/wishlisted.svg' : 'src/assets/heart.svg'}
          alt="heart"
        />
      </div>
      <div className="review-box">
        <div className="rating-box">
          <h3>{rating}</h3>
          <h3>{'🍲'.repeat(Math.round(rating))}</h3>
        </div>
        <a href={reviewSrc}>Google Reviews</a>
      </div>
      <div className="tags-box">
        <div className="tags">{cuisine}</div>
        <div className="tags">{price}</div>
      </div>
      <div className="other-profiles-box">
        <div className="profiles-box">
          <div className="circle"></div>
          <div className="who-else-box">
            <p>
              See who <br></br> else might want to go
            </p>
            {isOpen && <div className="backdrop"></div>}
            <dialog open={isOpen}>
              <div className="close-button">
                <input
                  type="image"
                  src="src/assets/x.svg"
                  alt="close"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              <ConnectCard
                isDown={true}
                profileImg="src/assets/profile2.svg"
                user="Pedro"
                restaurantName="Shang's"
                phone="773-688-0000"
              />
              <ConnectCard
                isDown={false}
                profileImg="src/assets/profile2.svg"
                user="Pedro"
                restaurantName="Shang's"
              />
            </dialog>
            <input
              type="image"
              src="src/assets/arrow.svg"
              alt="arrow"
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
