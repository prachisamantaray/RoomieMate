import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {new Date().getFullYear()} RoomieMatch. Find a roommate who matches your lifestyle.</p>
      </div>
    </footer>
  );
};

export default Footer;
