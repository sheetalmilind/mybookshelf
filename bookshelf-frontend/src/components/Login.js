import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';
import { Link } from "react-router-dom";

import "../styles/Login.css";
//import User from "../../../models/User";


const Login = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
 
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error

    try {

      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/login`, formData);
      //alert(response.data.user.id);
      console.log("Server URL:", SERVER_URL);

      localStorage.setItem('id', response.data.user.id);
      localStorage.setItem('username',response.data.user.username);
      localStorage.setItem('token',response.data.token);
      localStorage.setItem('name',response.data.user.name);
      localStorage.setItem('user',response.data.user)
      //console.log(response);
      //UserContext.setUser(response.data.email);
      navigate("/dashboard"); // Redirect to dashboard on successful login
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      setErrorMessage(errorMsg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/forgot-password`, {
        email: forgotPasswordEmail,
        newPassword,
      });
      setMessage(response.data.message);
      setShowForgotPassword(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    }
  };


  return (
    <div className="login-container">

      {/* Home Button */}
      <Link to="/" className="home-button">
        Home
      </Link>

      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" className="btn-signin">Sign In</button>
      </form>
      
        
      
      <button className="forgot-password-link" onClick={() => setShowForgotPassword(true)}>
        Forgot Password?
      </button>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button>
            <button onClick={() => setShowForgotPassword(false)}>Cancel</button>
          </form>
        </div>
      )}
      
      
    </div>
  );
};

export default Login;
