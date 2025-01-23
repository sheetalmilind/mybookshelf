import React from "react";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="homepage-container">
      {/* Header */}
      <header className="homepage-header">
        <h1>📚 Bookshelf</h1>
      </header>

      {/* Announcement Banner */}
      <div className="announcement-banner">
        <h2>Your one-stop destination for discovering and reading your favorite books!</h2>
      </div>

      <div className="homepage-content">
        {/* Discover Section */}
        <div className="discover-section">
          <h3>Discover Your Next Favorite Book</h3>
          <button className="btn btn-signup" onClick={handleSignUp}>
            Sign Up
          </button>
          <button className="btn btn-login" onClick={handleLogin}>
            Log In
          </button>
          <p className="terms">
            By signing up, you agree to the Bookshelf{" "}
            <a href="/terms" target="_blank" rel="noopener noreferrer">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>.
          </p>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <div className="info-box">
            <h4>Deciding what to read next?</h4>
            <p>
              Tell us what titles or genres you’ve enjoyed, and we’ll provide personalized
              recommendations tailored just for you.
            </p>
          </div>
          <div className="info-box">
            <h4>What are your friends reading?</h4>
            <p>
              Discover the books your friends are discussing and join the conversation about your favorite reads.
            </p>
          </div>
        </div>

        {/* Recommendation Section */}
        <div className="recommendation-section">
          <h3>What will you discover?</h3>
          <p>Because ♥Meagan♥ liked...</p>
          <div className="book-carousel">
            <img
              src="https://via.placeholder.com/100x150"
              alt="Book Cover 1"
              className="book-card"
            />
            <img
              src="https://via.placeholder.com/100x150"
              alt="Book Cover 2"
              className="book-card"
            />
            <img
              src="https://via.placeholder.com/100x150"
              alt="Book Cover 3"
              className="book-card"
            />
            <img
              src="https://via.placeholder.com/100x150"
              alt="Book Cover 4"
              className="book-card"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
