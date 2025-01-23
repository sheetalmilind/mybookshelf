// routes/socialcardRoutes.js
const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');


const {
    getReviewsForDashboard,postReview,
  } = require('../controllers/socialController');

// Route to create a new social card (post a review/update)
//router.post('/post-update', socialController.createSocialCard);

// Route to get social cards (reviews/updates) from friends
router.get('/friend-updates/:userId', getReviewsForDashboard);

// Route to get reviews for user and friends
//router.get("/dashboard-reviews/:userId", socialController.getReviewsForDashboard);
router.post('/reviews', postReview); // Route to post a review

module.exports = router;
