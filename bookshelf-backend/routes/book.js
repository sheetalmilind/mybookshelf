const express = require('express');
//const { authenticateUser } = require('../middleware/authMiddleware');
//const bookController = require('../controllers/bookController');
const router = express.Router();
const {
  getCurrentlyReading,
  addCurrentlyReading,
  updateProgress,
  finishBook,
  searchBooks,
  addBook,
  addBookToUser,
  getBookProgress,
  getBooksWithReviewsForUser,
  getAllBooks,
} = require('../controllers/bookController');


// Route to search books
router.get("/search", searchBooks);

// Route to add a book
router.post("/add", addBook);

//Route to add book in user table
router.post("/addBookUser",addBookToUser);

// Get all "Currently Reading" books
// Route to get currently reading books
router.get('/currently-reading/:userId', getCurrentlyReading);

// Add a book to "Currently Reading"
router.post('/currently-reading', addCurrentlyReading);

// Route to update book progress for a user
router.put('/update-progress/:userId/:bookId', updateProgress);

// Route to fetch progress for a book
router.get('/progress/:userId/:bookId', getBookProgress);

// Mark a book as "Finished"
router.put('/finish/:id', finishBook);
//console.log("route");

router.get('/get-books-with-reviews/:userId', getBooksWithReviewsForUser);

router.get('/getbooks', getAllBooks); // Route to get all books
module.exports = router;
