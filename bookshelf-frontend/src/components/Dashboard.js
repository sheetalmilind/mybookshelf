import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateProgressModal from "./UpdateProgressModal"; 
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import SocialCard from './SocialCard';

import '../styles/Dashboard.css';


const Dashboard = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [showSearch, setShowSearch] = useState(false); // Toggle search bar visibility
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState(""); // Search query
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message
  const [currentlyReading, setCurrentlyReading] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [user, setUser] = useState(null); 
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);  
  
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the user session from localStorage
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');

    // Redirect to the login page
    navigate("/login");
  };
  
  // Fetch results as user types (debounced live search)
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/search?query=${query}`);
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch books. Please try again later.");
        }
        const data = await response.json();
        console.log(data);
        setSearchResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 500); // Add a 500ms delay for debouncing

    return () => clearTimeout(delayDebounce);
  }, [query]);


  

  // Handle adding a book
  const handleAddBook = async (book) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/addBookUser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.image,
          
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setCurrentlyReading([...currentlyReading, book]); // Update currently reading list
        alert('Book added to your currently reading list');
      } else {
        alert(data.message || 'Failed to add book');
      }
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };


   // Add Book to Currently Reading
   const addToCurrentlyReading = (book) => {
    setCurrentlyReading((prev) => [...prev, book]);
    setSearchQuery(""); // Reset search bar
    setSearchResults([]); // Clear search results after adding
    setShowSearch(false);
    
    
  };

    //fetch the progress value
    const fetchBookProgress = async (userId, bookId) => {
      try {
        const response = await fetch(`/api/books/progress/${userId}/${bookId}`);
        const data = await response.json();
    
        if (response.ok) {
          return data.progress; // Return the progress value
        } else {
          console.error(data.message || 'Failed to fetch book progress');
          return null;
        }
      } catch (error) {
        console.error('Error fetching book progress:', error);
        return null;
      }
    };

  
  
    useEffect(() => {
      const fetchReviews = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/socialcard/dashboard-reviews/${localStorage.getItem("id")}`);
          //, {
          //  headers: {
          //    Authorization: `Bearer ${localStorage.getItem("token")}`, // Example for JWT
          //  },
          
          const data = await response.json();
          setReviews(data);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };
  
      fetchReviews();
    }, []);
  



     
 // useEffect(() => {
    const fetchCurrentlyReading = async (page) => {
      //const user = JSON.parse(localStorage.getItem('user')); // Retrieve user info from localStorage

      //if (!user) return;
      const userId = localStorage.getItem("id");
      try {

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/currently-reading/${userId}`);
        const data = await response.json();
        setItems(data.items);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);


        if (response.ok) {
          const booksWithProgress = await Promise.all(
            data.books.map(async (book) => {
              try {
                const progressResponse = await fetch(
                  `${process.env.REACT_APP_SERVER_URL}/api/books/progress/${userId}/${book._id}` // Use book._id as the book ID
                );
                const progressData = await progressResponse.json();

                return {
                  ...book,
                  progress: progressData.progress || 0, // Add progress field
                };
              } catch (error) {
                console.error(`Error fetching progress for book ${book._id}:`, error);
                return { ...book, progress: 0 }; // Default progress to 0 on error
              }
            })
          );


          setCurrentlyReading(booksWithProgress);
        } else {
          console.error(data.message || 'Failed to fetch currently reading books');
        }
      } catch (error) {
        console.error('Error fetching currently reading books:', error);
      }
    };

    const handleUpdateProgress = (book) => {
      setSelectedBook(book);
      setIsProgressModalOpen(true);
      
    };
  
    const handleProgressUpdated = (updatedBook) => {
      // Close the modal
      setIsProgressModalOpen(false);
  
      // Update the local state with the updated book progress
      setCurrentlyReading((prevBooks) =>
        prevBooks.map((book) =>
          book._id === updatedBook._id ? { ...book, progress: updatedBook.progress } : book
        )
      );
      fetchCurrentlyReading();
    };



    useEffect(() => {
      fetchCurrentlyReading(currentPage);
    }, [currentPage]);

   

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
 

// Handle progress update
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <h1>Your Bookshelf</h1>
        </div>
        <div className="header-right">
    <nav className="nav-links">
      <Link to="/mybooks">My Books</Link>
      
    </nav>
    <div className="header-user-info">
      <p className="user-name">Welcome, {localStorage.getItem("name")}</p>
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  </div>
</header>

      

      {/* Currently Reading Section */}
      <section className="currently-reading">
        <h2>Currently Reading</h2>
        <div className="book-list">
          {currentlyReading.length === 0 ? (
            <p>No books added yet. Start adding some books!</p>
          ) : (
            currentlyReading.map((book, index) => (
              <div key={index} className="book-item">
                <div className="book-image-container">
                  <img src={book.coverImage} alt={book.title} className="book-image" />
                </div>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p>by {book.author}</p>
                  <p>Progress: {book.progress}%</p>
                </div>
                <button className="update-progress-btn" onClick={() => handleUpdateProgress(book)}>Update Progress</button>
              </div>
            ))
          )}
        </div>
        {/* Show Update Progress Modal */}
      {isProgressModalOpen && (
        <UpdateProgressModal
          book={selectedBook}
          onClose={() => setIsProgressModalOpen(false)}
          onProgressUpdated={handleProgressUpdated}
        />
      )}

      </section>

      {/* Reviews Section */}
      
      <div className="reviews-container">
      <h2>Reviews</h2>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review._id}>
              <div className="user-id"><strong>User ID:</strong> {review.userId}</div>
              <div className="review-text"><strong>Review:</strong> {review.review}</div>
              <div className="rating"><strong>Rating:</strong> {review.rating}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="no-reviews">No reviews available.</div>
      )}
    </div>
        {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

     
    </div>
  );
};

export default Dashboard;