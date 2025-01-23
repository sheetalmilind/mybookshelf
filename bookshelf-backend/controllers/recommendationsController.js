const Book = require('../models/Book');

exports.getRecommendations = async (req, res) => {
  try {
    // Fetch books based on a simple recommendation algorithm
    const recommendations = await Book.find().limit(10); // Example: Fetch 10 books
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
};
