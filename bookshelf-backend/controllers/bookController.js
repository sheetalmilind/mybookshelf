//import { Types } from 'mongoose';
const mongoose = require("mongoose");
const Book = require('../models/Book');
const User = require('../models/User');
const review = require('../models/SocialCard');
const axios = require("axios");
//const SocialCard = require("../models/SocialCard");
const { ObjectId } = mongoose.Types;
require("dotenv").config();
const apiKey = process.env.NPI_API_KEY; 
//const { NYT_API_KEY } = '9C0iNhRtXUXrAbOPfLMVqjfAQONQZd9S'; // Ensure your API key is loaded from environment variables



// Search books using the NYT Books API
exports.searchBooks = async (req, res) => {

  if (!apiKey) {
    return res.status(500).json({ error: "API key not found" });
  }
    console.log("in search book API");
    console.log(req);
    const { query } = req.query;
    console.log(query);
  
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }
  
    try {
      const response = await axios({
        method: "get",
        url: "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json",
        params: {
          title: query,
            //"api-key": "9C0iNhRtXUXrAbOPfLMVqjfAQONQZd9S",
            "api-key": apiKey,
        },
      });
      
      
      //console.log(response);
      const books = response.data.results.books.map((book) => ({
        title: book.title,
        author: book.author,
        description: book.description,
        image: book.book_image||'https://via.placeholder.com/100x150',
        //pages: crypto.randomInt(100,300),
      }));
      //console.log(books);
      return res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching books:", error);
      return res
        .status(500)
        .json({ message: "Failed to fetch books. Please try again later." });
    }
  };
  
  // Add a book to the user's bookshelf
  // Controller to add a new book to MongoDB and associate it with the use
exports.addBook = async (req, res) => {
  const { title, author, imageUrl } = req.body; // Extract book details from request body
  const userId = req.user._id; // Get user ID from the authenticated user in the request
 
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      message: 'Title and author are required.',
    });
  }

  try {
    // Check if the book already exists for the user
    const existingBook = await Book.findOne({ title, author, userId });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book already exists in your collection.',
      });
    }

    // Create a new book
    const newBook = new Book({
      title,
      author,
      imageUrl,
      status: 'notStarted', // Default status for new books
      userId, // Associate the book with the logged-in user
    });

    // Save the new book in the database
    await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      book: newBook,
    });
  } catch (error) {
    console.error('Error saving book:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add the book. Please try again later.',
    });
  }
};


exports.addBookToUser = async (req, res) => {
  const { userId, title, author, description, coverImage } = req.body;
  const user_newId = userId.toString();

  console.log("\""+ user_newId +"\"");
    try {
    
    if (ObjectId.isValid( userId )) {
      const user = await User.findById(new ObjectId( userId ));
      console.log(user);
   
    //const user = await User.findById(con_userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the book exists in the database, otherwise add it
    let book = await Book.findOne({ title, author });
    if (!book) {
      book = new Book({ title, author, description, coverImage });
      await book.save();
    }
    const bookId = book._id;
    console.log(bookId);
    // Check if the book is already in the user's list
    const bookExists = user.books.some((b) => b.book_id.toString() === bookId.toString());
    if (bookExists) {
      return res.status(400).json({ message: 'Book is already in the user’s list' });
    }

    // Add the book to the user's list with the initial status and progress
    user.books.push({ book_id: book._id, status: 'currently-reading', progress: 0,title:book.title,author:book.author,coverImage:book.coverImage });
    await user.save();

    res.status(200).json({ message: 'Book added to user’s list successfully', books: user.books });
  } else {
    console.error("Invalid ObjectId provided.");
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



// Get currently reading books for a user
exports.getCurrentlyReading = async (req, res) => {
  const { userId } = req.params;

  try {
    // Step 1: Find the user's currently reading books
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the starting index for the query
    const startIndex = (page - 1) * limit; 

    


    const user = await User.findById(userId).populate('books.book_id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Filter the user's books for those with status 'currently-reading'
    const currentlyReadingBooks = user.books
      .filter((book) => book.status === 'currently-reading')
      .map((book) => book.book_id);

    // Step 3: Fetch the metadata from the Book schema for the relevant book IDs
    const books = await Book.find({ _id: { $in: currentlyReadingBooks } })
      .skip(startIndex)
      .limit(limit);

         // Determine if there's another page
    const nextPageAvailable = books.length === limit;
    
    res.status(200).json({
      success: true,
      currentPage: page,
      nextPageAvailable,
      message: 'Currently reading books fetched successfully',
      books,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Add a book to "Currently Reading"
exports.addCurrentlyReading = async (req, res) => {
  const { title, author } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      currentlyReading: true,
    });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book to currently reading', error });
  }
};

// Update progress of a book for a user
exports.updateProgress = async (req, res) => {
  const { userId, bookId } = req.params; // User ID and Book ID
  const { progress, comment } = req.body; // Progress percentage and optional comment
  //console.log(progress);
  try {
    // Validate progress value
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's books array and update progress
    const bookIndex = user.books.findIndex((book) => book.book_id.toString() === bookId);

    if (bookIndex === -1) {
      return res.status(404).json({ message: 'Book not found in user collection' });
    }

    // Update the progress and add a comment
    user.books[bookIndex].progress = progress;
    if (comment) {
      user.books[bookIndex].comment = comment;
    }
    //console.log(progress);
    // If progress reaches 100%, update the status to 'finished-reading'
    if (parseInt(progress) === 100) {
      console.log(progress);
      user.books[bookIndex].status = 'finished';
    }

    // Save the user document
    await user.save();

    res.status(200).json({ message: 'Progress updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Mark a book as "Finished"
exports.finishBook = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { progress: 100, currentlyReading: false },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Error marking book as finished', error });
  }
};

exports.getBookProgress = async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the book in the user's books array
    const bookEntry = user.books.find((book) => book.book_id.toString() === bookId);

    if (!bookEntry) {
      return res.status(404).json({ message: 'Book not found for the user' });
    }

    // Return the progress value
    res.status(200).json({ progress: bookEntry.progress });
  } catch (error) {
    console.error('Error fetching book progress:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Fetch all books
/*exports.getAllBooks = async (req, res) => {
  try {
    console.log("bookcontroller");
    const books = await Book.find(); // Get all books from the database
    res.json(books); // Send books as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};*/

// Fetch all books for a specific user
exports.getAllBooksForUser = async (req, res) => {
  const { user_id } = localStorage.getItem("id");

  try {
    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user's book list
    const user = await User.findById(user_id).populate("books.book_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract books with metadata
    const books = user.books.map((entry) => ({
      book_id: entry.book_id._id,
      title: entry.book_id.title,
      author: entry.book_id.author,
      image: entry.book_id.image || "/default-book-cover.jpg",
      status: entry.status,
      progress: entry.progress,
    }));

    res.status(200).json({ books });
  } catch (error) {
    console.error("Error fetching books for user:", error);
    res.status(500).json({ message: "Failed to fetch books." });
  }
};



exports.getBooksWithReviewsForUser = async (req, res) => {
  try {
    const { userId } = req.params; // Assuming user ID is available from authentication middleware
    console.log("Bookcontroller");
    // Fetch the user's books
    const user = await User.findById(userId).populate('books.book_id').exec();
    const userBooks = user.books.map((book) => book.book_id);

    // Fetch reviews for these books (including reviews by friends)
    const reviews = await review.find({
      $or: [
        { userId }, // Reviews by the logged-in user
        { userId: { $in: user.friends.map((friend) => friend.friendId) } }, // Reviews by friends
      ],
      bookId: { $in: userBooks.map((book) => book._id) }, // Match only books the user owns
    })
      .populate('bookId')
      .populate('userId')
  
      .exec();

    // Create a map to associate reviews with books
    const reviewsByBookId = reviews.reduce((acc, review) => {
      if (!acc[review.bookId._id]) {
        acc[review.bookId._id] = [];
      }
      acc[review.bookId._id].push(review);
      return acc;
    }, {});

    // Combine books and their reviews
    const booksWithReviews = userBooks.map((book) => ({
      bookId: book,
      reviews: reviewsByBookId[book._id] || [], // Include books with no reviews
    }));

    res.status(200).json({ booksWithReviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching books with reviews', error });
  }
};


// In the controller
exports.getAllReviewsForUserAndFriends = async (req, res) => {
  try {
    const { userId } = req.params; // Get the userId from the request params
    const user = await User.findById(userId).populate('friends.friendId').exec();

    // Get the user's friends' IDs
    const friendIds = user.friends.map(friend => friend.friendId._id);

    // Fetch all reviews from the user and their friends
    const reviews = await Review.find({
      $or: [
        { userId }, // Reviews by the user
        { userId: { $in: friendIds } } // Reviews by the user's friends
      ]
    })
      .populate('bookId') // Populate the book information
      .populate('userId') // Populate the user information (reviewer)
      .exec();

    // Send back the reviews
    res.status(200).json({ reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Fetch all books
exports.getAllBooks = async (req, res) => {
  try {
    console.log("bookcontroller");
    const books = await Book.find(); // Get all books from the database
    res.json(books); // Send books as a response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
