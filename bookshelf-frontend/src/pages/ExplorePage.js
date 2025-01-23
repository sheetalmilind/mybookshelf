import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { getRecommendations } from '../api/api';

const ExplorePage = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getRecommendations();
        setRecommendations(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4">Explore</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {recommendations.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2">By {book.author}</Typography>
                <Button variant="contained" sx={{ mt: 1 }}>
                  Add to Bookshelf
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ExplorePage;
