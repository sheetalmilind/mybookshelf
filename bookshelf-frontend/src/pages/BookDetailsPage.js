import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, Button, TextField, Rating } from '@mui/material';
import { getBookDetails, addBookToShelf, addReview } from '../api/api';

const BookDetailsPage = () => {
  const { id } = useParams(); // Book ID from URL
  const [book, setBook] = useState(null);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await getBookDetails(id);
        setBook(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleAddToShelf = async (status) => {
    try {
      await addBookToShelf({ bookId: id, status });
      alert(`Book added to ${status} list.`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddReview = async () => {
    try {
      await addReview({ bookId: id, review, rating });
      alert('Review submitted.');
      setReview('');
      setRating(0);
    } catch (error) {
      console.error(error);
    }
  };

  if (!book) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">{book.title}</Typography>
      <Typography variant="h6">By {book.author}</Typography>
      <Typography variant="body1">{book.description}</Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" onClick={() => handleAddToShelf('reading')}>
          Mark as Currently Reading
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleAddToShelf('finished')} sx={{ ml: 2 }}>
          Mark as Finished
        </Button>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Add a Review</Typography>
        <Rating value={rating} onChange={(e, newValue) => setRating(newValue)} />
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          label="Write your review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          sx={{ mt: 2 }}
        />
        <Button variant="contained" onClick={handleAddReview} sx={{ mt: 2 }}>
          Submit Review
        </Button>
      </Box>
    </Box>
  );
};

export default BookDetailsPage;