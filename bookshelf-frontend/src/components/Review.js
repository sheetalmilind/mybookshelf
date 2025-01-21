import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Review = ({ onReviewUpdate }) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const { bookId } = useParams(); // Get bookId from URL
  const navigate = useNavigate();
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [existingReview, setExistingReview] = useState(null);
  const [booksWithReviews, setBooksWithReviews] = useState([]);

  useEffect(() => {
    // Fetch existing review for the book (if any)
    axios
      .get(`${process.env.REACT_APP_SERVER_URL}/api/socialcard/reviews/${localStorage.getItem("id")}/${bookId}`)
      .then((response) => {
        const reviewData = response.data;
        if (reviewData) {
          setReviewText(reviewData.review);
          setRating(reviewData.rating);
          setExistingReview(reviewData);
        }
      })
      .catch((error) => console.error('Error fetching review:', error));
  }, [bookId]);

   // Fetch books with reviews on component load
   const fetchBooksWithReviews = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/socialcard/reviews/${localStorage.getItem("id")}/${bookId}`
      );
      setBooksWithReviews(response.data.booksWithReviews);
    } catch (error) {
      console.error("Error fetching books with reviews:", error);
    }
  };

  useEffect(() => {
    fetchBooksWithReviews();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    const apiCall = existingReview
      ? axios.put(`${process.env.REACT_APP_SERVER_URL}/api/socialcard/reviews/${existingReview._id}`, {
          review: reviewText,
          rating,
          userId: localStorage.getItem('id'),
        })
      : axios.post(`${process.env.REACT_APP_SERVER_URL}/api/socialcard/reviews`, {
          bookId: localStorage.getItem("book_Id"),
          review: reviewText,
          rating,
          userId: localStorage.getItem('id'),
        });

    apiCall
      .then((response) => {
        alert('Review saved successfully!');
        if (onReviewUpdate) onReviewUpdate(); // Notify MyBooks page
        navigate('/mybooks'); // Navigate back to MyBooks page
      })
      .catch((error) => {
        console.error('Error saving review:', error);
        alert('Failed to save review.');
      });
  };

  const handleDelete = () => {
    if (existingReview) {
      axios
        .delete(`${process.env.REACT_APP_SERVER_URL}/api/socialcard/reviews/${existingReview._id}`, {
          data: { userId: localStorage.getItem('id') },
        })
        .then(() => {
          alert('Review deleted successfully!');
          if (onReviewUpdate) onReviewUpdate(); // Notify MyBooks page
          navigate('/mybooks'); // Navigate back to MyBooks page
        })
        .catch((error) => {
          console.error('Error deleting review:', error);
          alert('Failed to delete review.');
        });
    }
  };

   // Close the review page
   const handleClose = () => {
    navigate('/mybooks'); // Navigate to MyBooks page
  };

  return (
    <div>
      <h1>{existingReview ? 'Edit Review' : 'Write a Review'}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label>Review:</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your review here..."
            required
          />
        </div>
        <button type="submit">{existingReview ? 'Update Review' : 'Post Review'}</button>
        {existingReview && (
          <button type="button" onClick={handleDelete}>
            Delete Review
          </button>
          
        )}
        <button onClick={handleClose} style={{ marginLeft: '10px' }}>
          Close
        </button>
      </form>
    </div>
  );
};

export default Review;
