import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid2, Card, CardContent } from '@mui/material';
import { getUserProfile } from '../api/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookshelf, setBookshelf] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserProfile(token);
        setUser(response.data.user);
        setBookshelf(response.data.bookshelf);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [token]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="h6">Username: {user.username}</Typography>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Bookshelf</Typography>
        <Grid2 container spacing={3}>
          {bookshelf.map((book) => (
            <Grid2 item xs={12} sm={6} md={4} key={book.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2">By {book.author}</Typography>
                  <Typography variant="body2">Status: {book.status}</Typography>
                  <Typography variant="body2">Rating: {book.rating}</Typography>
                  <Typography variant="body2">{book.review}</Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Box>
  );
};

export default Profile;
