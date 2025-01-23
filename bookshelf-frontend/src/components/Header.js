import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>Bookshelf</h1>
      </div>
      <nav className="nav-links">
        <a href="/home">Home</a>
        <a href="/my-books">My Books</a>
        <a href="/browse">Browse</a>
        <a href="/community">Community</a>
      </nav>
      <div className="header-right">
        <input type="text" className="search-bar" placeholder="Search books" />
        <div className="icon-group">
          <span className="icon notification-icon">🔔</span>
          <span className="icon profile-icon">👤</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
