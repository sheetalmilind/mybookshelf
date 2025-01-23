// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/Global.css';
import HomePage from './components/HomePage';
import Signup from './components/SignUp';
import Login from './components/Login';
//import Search from './components/Search';
import Friend from './components/Friend';
import BookDetails from './components/BookDetails';
import Dashboard from './components/Dashboard';
import Review from './components/Review';
import MyBooks from './components/MyBooks';




const App = () => {
  return (
  
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book/:bookId" element={<BookDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/friends" element={<Friend />} /> {/* Route for Add Friend */}
        <Route path="/post-review" element={<Review />} />
        <Route path='/mybooks' element={<MyBooks />} />
        <Route path="/review" element={<Review />} />
        <Route path="/review/:userId/:bookId" element={<Review />} />
        
      </Routes>
    </Router>
    
  );
};

export default App;
