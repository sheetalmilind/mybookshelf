const express = require('express');
const { addBookToShelf, getBookshelf } = require('../controllers/bookshelfController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, addBookToShelf);
router.get('/', authMiddleware, getBookshelf);

module.exports = router;
