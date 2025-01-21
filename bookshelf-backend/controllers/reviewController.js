const SocialCard = require('../models/SocialCard'); // Assuming SocialCard is the Mongoose model
const Book = require('../models/Book'); // Assuming Book is the model for books
const User = require('../models/User');
const review = require('../models/SocialCard');

// Create a new review with rating
exports.createReview = async (req, res) => {
  try {
    const { bookId, review, rating, userId } = req.body;

    // Validate input
    if (!bookId || !userId) {
      return res.status(400).json({ message: 'Book ID and User ID are required.' });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Create a new review with rating
    const newReview = new SocialCard({
      bookId,
      review,
      rating,
      userId,
    });

    await newReview.save();

    // Optionally, update book average rating (if needed)
    //await updateBookRating(bookId);

    res.status(201).json({ message: 'Review and rating created successfully.', review: newReview });
  } catch (error) {
    console.error('Error creating review and rating:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Update an existing review and/or rating
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { review, rating, userId } = req.body;

    // Validate input
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    // Find the review and ensure it belongs to the user
    const existingReview = await SocialCard.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    if (existingReview.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this review.' });
    }

    // Update the review and/or rating
    if (review !== undefined) existingReview.review = review;
    if (rating !== undefined) existingReview.rating = rating;

    await existingReview.save();

    // Update book average rating (if needed)
    await updateBookRating(existingReview.bookId);

    res.status(200).json({ message: 'Review and/or rating updated successfully.', review: existingReview });
  } catch (error) {
    console.error('Error updating review and/or rating:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Delete a review and rating
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body;

    // Find the review and ensure it belongs to the user
    const review = await SocialCard.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this review.' });
    }

    const bookId = review.bookId;

    // Delete the review
    await SocialCard.findByIdAndDelete(reviewId);

    // Update book average rating (if needed)
    await updateBookRating(bookId);

    res.status(200).json({ message: 'Review and rating deleted successfully.' });
  } catch (error) {
    console.error('Error deleting review and rating:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Helper function to update the book's average rating
const updateBookRating = async (bookId) => {
  try {
    // Fetch all reviews for the book
    const reviews = await SocialCard.find({ bookId });

    // Calculate the average rating
    const totalRatings = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    const averageRating = reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    // Update the book's average rating in the Book model
    await Book.findByIdAndUpdate(bookId, { averageRating });
  } catch (error) {
    console.error('Error updating book average rating:', error);
  }
};



exports.getBookWithReview = async (req, res) => {
    try {

      const userId = req.params.userId;
      //console.log(req.params);
      const bookId = req.params.bookId; // Assuming user ID is available from authentication middleware
      //console.log( req.params.bookId );
      //console.log("reviewcontroller");
      // Fetch the user's books
     // const user = await User.findById(userId).populate('books.book_id').exec();
      //const userBooks = user.books.map((book) => book.book_id);
  
      // Validate bookId
    if (!bookId) {
        return res.status(400).json({ message: 'Book ID is required' });
      }
      
      // Fetch the review from the database
      const existing_review = await review.findOne({ userId, bookId });
  
      // Check if review exists
      if (!existing_review) {
        return res.status(404).json({ message: 'No review found for this book and user' });
      }
  
      // Return the review
      res.status(200).json(existing_review);
    } catch (error) {
      console.error('Error fetching review:', error.message);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  };
  

  


// Endpoint to fetch reviews for the logged-in user and their friends
exports.getAllReviewsForUserAndFriends = async (req, res) =>  {
    try{
      // Assume we get the logged-in user's ID from the request (e.g., via JWT)
      const loggedInUserId = req.params.userId;
  
      // Fetch the logged-in user's friends list
      const loggedInUser = await User.findById(loggedInUserId).select("friends");
  
      if (!loggedInUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Create an array of user IDs to fetch reviews for (logged-in user + friends)
      const userIds = [loggedInUserId, ...loggedInUser.friends];
  
      // Fetch reviews from the socialcards collection
      const reviews = await SocialCard.find({ userId: { $in: userIds } });
  
      res.json(reviews);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while fetching reviews" });
    }
  };