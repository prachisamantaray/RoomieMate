import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🤝</span>
          <span>RoomieMatch</span>
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="navbar-menu">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                end
              >
                Home
              </NavLink>
            </li>

            {currentUser && (
              <>
                <li>
                  <NavLink 
                    to="/dashboard" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/profile" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink 
                    to="/requests" 
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    Requests
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Navbar Action Buttons */}
        <div className="navbar-actions">
          {currentUser ? (
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
