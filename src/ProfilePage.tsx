import './ProfilePage.css';

import defaultPic from './assets/profile.svg';
import Card from './components/Card';
import Navbar from './components/Navbar';

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="pic-container">
          <img className="user-pic" src={defaultPic} alt="your user profile" />
        </div>
        <h2>Rachel Nguyen</h2>
        <div className="pref-card">
          <p className="pref-card-title">Your Favorite Cuisines</p>
          <div className="cuisine-box">
            <p className="cuisine-tag">Mexican</p>
            <p className="cuisine-tag">Indian</p>
            <p className="cuisine-tag">Brazilian</p>
            <p className="cuisine-tag">Vietnamese</p>
          </div>
        </div>
        <div className="pref-card">
          <p className="pref-card-title">Your Price Range</p>
          <div className="price-container">
            <p>Max: $100</p>
            <p>——</p>
            <p>Min: $30</p>
          </div>
        </div>
        <div>
          <h2>Your Tastemates</h2>
          <div className="tastemates-container">
            <div className="tastemate-box">
              <img className="tastemate-pic" src={defaultPic} alt="your user profile" />
              <div className="tastemate-name">bruce</div>
            </div>
            <div className="tastemate-box">
              <img className="tastemate-pic" src={defaultPic} alt="your user profile" />
              <div className="tastemate-name">laura</div>
            </div>
            <div className="tastemate-box">
              <img className="tastemate-pic" src={defaultPic} alt="your user profile" />
              <div className="tastemate-name">nikky</div>
            </div>
            <div className="tastemate-box">
              <img className="tastemate-pic" src={defaultPic} alt="your user profile" />
              <div className="tastemate-name">aninha</div>
            </div>
          </div>
        </div>
        <div>
          <h2>Your Wishlist</h2>
          <div className="wishlist">
            <Card
              isFeed={false}
              restaurantName="Frida's"
              rating={4.7}
              reviewSrc="https://g.co/kgs/3F6zToD"
              cuisine="Mexican"
              price="$"
            />
            <Card
              isFeed={false}
              restaurantName="Frida's"
              rating={4.7}
              reviewSrc="https://g.co/kgs/3F6zToD"
              cuisine="Mexican"
              price="$"
            />
            <Card
              isFeed={false}
              restaurantName="Frida's"
              rating={4.7}
              reviewSrc="https://g.co/kgs/3F6zToD"
              cuisine="Mexican"
              price="$"
            />
            <Card
              isFeed={false}
              restaurantName="Frida's"
              rating={4.7}
              reviewSrc="https://g.co/kgs/3F6zToD"
              cuisine="Mexican"
              price="$"
            />
            {/* <p>calos</p>
            <p>kasama</p>
            <p>cebu</p>
            <p>daves italian</p>
            <p>cozy corner</p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
