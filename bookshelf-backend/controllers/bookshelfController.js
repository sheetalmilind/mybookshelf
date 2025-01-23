const Book = require('../models/Book');
//const Review = require('../models/Review');

exports.addBookToShelf = async (req, res) => {
  try {
    const { bookId, status } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    req.user.bookshelf = req.user.bookshelf || {};
    req.user.bookshelf[status] = req.user.bookshelf[status] || [];
    req.user.bookshelf[status].push(bookId);

    await req.user.save();
    res.json({ message: 'Book added to shelf successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to shelf', error });
  }
};

exports.getBookshelf = async (req, res) => {
  try {
    const bookshelf = req.user.bookshelf || {};
    res.json(bookshelf);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bookshelf', error });
  }
};
