import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ShopHub
        </Link>
        
        <div className="navbar-links">
          {!token ? (
            <>
              <Link to="/login" className="navbar-link">User Login</Link>
              <Link to="/admin/login" className="navbar-link">Admin Login</Link>
            </>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
              )}
              <span className="navbar-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="navbar-button">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
