import './Navbar.css';

import { MapPin, MessageSquare, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/feed', icon: MessageSquare, label: 'Feed' },
    { path: '/explore', icon: MapPin, label: 'Explore' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="navbar">
      {navItems.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          className={`nav-item ${location.pathname === path ? 'active' : ''}`}
          onClick={() => navigate(path)}
          aria-label={label} // Improve accessibility by adding an aria-label
        >
          <Icon className="nav-icon" />
          <p className="nav-label">{label}</p>
        </button>
      ))}
    </div>
  );
};

export default Navbar;
