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
      <div className="card-container">
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
                src={isFollowing ? '/assets/following.svg' : '/assets/add-user.svg'}
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
            src={isWishlist ? '/assets/wishlisted.svg' : '/assets/heart.svg'}
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
            <div className="who-else-pics">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
            <div className="who-else-box">
              <p className="see-who-text">
                See who <br></br> else might want to go
              </p>
              {isOpen && <div className="backdrop"></div>}
              <dialog open={isOpen}>
                <div className="close-button">
                  <input
                    type="image"
                    src="/assets/x.svg"
                    alt="close"
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <ConnectCard
                  isDown={true}
                  profileImg="/assets/profile2.svg"
                  user="Ana"
                  restaurantName={restaurantName}
                  phone="773-688-0000"
                />
                <ConnectCard
                  isDown={false}
                  profileImg="/assets/profile2.svg"
                  user="Ana"
                  restaurantName={restaurantName}
                />
                <ConnectCard
                  isDown={false}
                  profileImg="/assets/profile2.svg"
                  user="Nikky"
                  restaurantName={restaurantName}
                />
                <ConnectCard
                  isDown={false}
                  profileImg="/assets/profile2.svg"
                  user="Marissa"
                  restaurantName={restaurantName}
                />
                <ConnectCard
                  isDown={false}
                  profileImg="/assets/profile2.svg"
                  user="Daniel"
                  restaurantName={restaurantName}
                />
                <ConnectCard
                  isDown={false}
                  profileImg="/assets/profile2.svg"
                  user="Laura"
                  restaurantName={restaurantName}
                />
              </dialog>
              <input
                type="image"
                src="/assets/arrow.svg"
                alt="arrow"
                onClick={() => setIsOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
