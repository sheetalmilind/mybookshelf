// controllers/socialcardController.js
const SocialCard = require('../models/SocialCard');
const User = require('../models/User');
const Book = require('../models/Book');

// Create a new social card (review/update for a book)
const createSocialCard = async (req, res) => {
  try {
    const { userId, content, rating, bookId } = req.body;

    // Validate the data
    if (!content || !rating || !bookId) {
      return res.status(400).json({ message: 'Content, rating, and bookId are required.' });
    }

    // Ensure the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    // Create the new social card (post)
    const newPost = new SocialCard({
      userId,
      content,
      rating,
      bookId,
    });

    // Save the new social card in the database
    await newPost.save();

    res.status(201).json({
      message: 'Post created successfully!',
      post: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

// Fetch reviews for the user and their friends
const getReviewsForDashboard = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from request parameters

    // Fetch the user's friends from the User collection
    const user = await User.findById(userId).populate("friends", "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Collect userId and friends' IDs
    const friendIds = user.friends.map((friend) => friend._id);
    const userAndFriendIds = [...friendIds, userId];

    // Fetch reviews by the user and their friends
    const reviews = await Review.find({ userId: { $in: userAndFriendIds } })
      .populate("bookId", "title author") // Populate book details
      .populate("userId", "name") // Populate user details
      .sort({ createdAt: -1 }); // Sort by latest reviews

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


// Post a review for a book
const postReview = async (req, res) => {
  const { bookId, review,userId } = req.body;
   // Assuming you have user authentication to get user ID
  console.log("social controller");
  try {
    const newReview = new SocialCard({
      bookId,
      review,
      userId,
    });

    await newReview.save(); // Save the review to the database

    // Optionally, add the review to the user's profile
    //const user = await User.findById(userId);
    //user.reviews.push(newReview._id); // Assuming you have a reviews field in User schema
    //await user.save();

    res.status(200).json({ message: 'Review posted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to post review' });
  }
};

module.exports = {
  getReviewsForDashboard,postReview,createSocialCard,
};