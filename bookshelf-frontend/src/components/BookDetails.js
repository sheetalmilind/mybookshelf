// src/components/BookDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`/api/books/${bookId}`);
        setBookDetails(response.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  if (!bookDetails) return <div>Loading...</div>;

  return (
    <div>
      <h1>{bookDetails.title}</h1>
      <img src={bookDetails.coverImage} alt={bookDetails.title} />
      <p>{bookDetails.description}</p>
      <p>Author: {bookDetails.author}</p>
    </div>
  );
};

export default BookDetails