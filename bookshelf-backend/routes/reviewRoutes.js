const express = require('express');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

// Create a new review and rating
router.post('/reviews', reviewController.createReview);

// Update an existing review and/or rating
router.put('/reviews/:reviewId', reviewController.updateReview);

// Delete a review and rating
router.delete('/reviews/:reviewId', reviewController.deleteReview);
//fetch review detail on loading of page
router.get('/reviews/:userId/:bookId',reviewController.getBookWithReview);

// Route to get all reviews for user and their friends
router.get('/dashboard-reviews/:userId', reviewController.getAllReviewsForUserAndFriends);

module.exports = router;
