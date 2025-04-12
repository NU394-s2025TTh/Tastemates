import './Navbar.css';

import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/feed', icon: '/assets/feed.svg', label: 'Feed' },
    { path: '/explore', icon: '/assets/explore.svg', label: 'Explore' },
    { path: '/profile', icon: '/assets/profile-page.svg', label: 'Profile' },
  ];

  return (
    <div className="navbar">
      {navItems.map(({ path, icon, label }) => (
        <button
          key={path}
          className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
          aria-label={label} // Improve accessibility by adding an aria-label
        >
          <img src={icon} alt={label} className="nav-icon" />
          <p className="nav-label">{label}</p>
        </button>
      ))}
    </div>
  );
};

export default Navbar;
