import './Navbar.css';

import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="navbar">
      <input
        onClick={() => navigate('/feed')}
        type="image"
        src="/assets/feed.svg"
        alt="feed"
        className={`icon ${location.pathname === '/feed' ? 'active' : ''}`}
      />
      <input
        onClick={() => navigate('/explore')}
        type="image"
        src="/assets/explore.svg"
        alt="explore"
        className={`icon ${location.pathname === '/explore' ? 'active' : ''}`}
      />
      <input
        onClick={() => navigate('/profile')}
        type="image"
        src="/assets/profile-page.svg"
        alt="profile"
        className={`icon ${location.pathname === '/profile' ? 'active' : ''}`}
      />
    </div>
  );
};

export default Navbar;
