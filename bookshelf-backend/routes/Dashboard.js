const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all currently reading books
router.get('/currently-reading', async (req, res) => {
  try {
    const books = await Book.find({ status: 'currently-reading' });
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update book progress
router.put('/update-progress/:id', async (req, res) => {
  const { progress, comment } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.progress = progress;
    book.comment = comment;

    if (progress === 100) {
      book.status = 'finished';
    }

    await book.save();
    res.json({ message: 'Book progress updated', book });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Mark book as finished
router.post('/mark-finished/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.progress = 100;
    book.status = 'finished';

    await book.save();
    res.json({ message: 'Book marked as finished', book });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// Add a new book (optional for testing)
router.post('/add-book', async (req, res) => {
  const { title, author } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
    });

    await newBook.save();
    res.json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
