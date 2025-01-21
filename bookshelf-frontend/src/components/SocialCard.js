// PostUpdateForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PostUpdateForm = ({ userId, bookId }) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${SERVER_URL}/api/social-cards/post-update`, {
        userId,
        content,
        rating,
        bookId,
      });

      alert("Update posted successfully!");
    } catch (error) {
      console.error("Error posting update", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's your review?"
        rows="4"
        required
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        required
      >
        <option value="1">1 - Poor</option>
        <option value="2">2 - Fair</option>
        <option value="3">3 - Good</option>
        <option value="4">4 - Very Good</option>
        <option value="5">5 - Excellent</option>
      </select>
      <button type="submit">Post Update</button>
    </form>
  );
};

export default PostUpdateForm;
