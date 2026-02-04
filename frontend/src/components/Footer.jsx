import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Shophub is your one-stop shop for amazing products at great prices.</p>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: contact@Shophub.com</p>
        </div>
        
        <div className="footer-section">
          <p>&copy; {new Date().getFullYear()} Shophub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
