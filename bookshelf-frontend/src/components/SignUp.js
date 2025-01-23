import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css"; // Import the CSS for styling

const Signup = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
      
    }

    try {
        console.log(SERVER_URL);
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/validateuser`, formData);

      // If user is created successfully
      setMessage(response.data.message);
      if(response.status === 201){
        navigate("/login");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
     
      setError("");
    } catch (err) {
      // Handle errors (like user already exists)
      setError(err.response ? err.response.data.message : "Server error");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create Account</h2>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Your name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
          />
        </div>
        <div className="input-group">
          <label>Re-enter password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <button type="submit" className="btn">Create account</button>
        </div>
      </form>
      <p>
        By creating an account, you agree to the BookShelf{" "}
        <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a> and{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
      </p>
    </div>
  );
};

export default Signup;
