import React, { useEffect, useState } from "react";
import axios from "axios";
import Review from "./Review"; // Review modal component
import "../styles/MyBooks.css";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"; 


const MyBooks = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [booksWithReviews, setBooksWithReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

 

  const navigate = useNavigate(); // React Router's navigation hook



  // Fetch books with reviews on component load
  const fetchBooksWithReviews = async (page) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/books/get-books-with-reviews/${localStorage.getItem("id")}`
      );
      setBooksWithReviews(response.data.booksWithReviews);
      setBooks(response.data.booksWithReviews);
      setCurrentPage(response.data.booksWithReviews.currentPage);
      setTotalPages(response.data.booksWithReviews.totalPages);

    } catch (error) {
      console.error("Error fetching books with reviews:", error);
    }
  };

  useEffect(() => {
    fetchBooksWithReviews(currentPage);
  }, []);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // Search books
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/books/search?query=${query}`
        );
        setSearchResults(response.data);
      } catch (err) {
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSearchResults();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

 // Handle "Write a Review" button click
 const handleWriteReview = (bookId) => {
  localStorage.setItem('book_Id',bookId);
  navigate(`/review/${localStorage.getItem("id")}/${bookId}`); // Navigate to the review page for the selected book
};

  // Refresh data and close modal after review update
  const handleCloseReviewModal = () => {
    setShowReviewModal(false); // Close modal
    fetchBooksWithReviews(); // Refresh books list
  };

  const handleLogout = () => {
    // Clear localStorage or any session storage
    localStorage.clear();
  
    // Redirect to the login page
    navigate("/");
  };

  // Update rating
  const handleRatingChange = async (bookId, rating) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_SERVER_URL}/api/socialcard/reviews/update-rating/${bookId}`,
        {
          rating,
        }
      );
      fetchBooksWithReviews(); // Refresh data after rating update
    } catch (error) {
      console.error("Error updating rating:", error);
      alert("Failed to update rating.");
    }
  };

  const handleAddToCurrentlyReading = async (book) => {
    const newBookData = {
      title: book.title,
      author: book.author,
      description: book.description || "",
      coverImage: book.image || "", // Fallback to an empty string if no image
    };
  
    try {
      const response = await fetch(`${SERVER_URL}/api/books/addBookUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("id"),
          ...newBookData,
        }),
      });
  
      const data = await response.json();
      
      console.log("API Response:", data); // Debug the response
      if (response.ok && data) {
        // Normalize new book for `booksWithReviews`
        //const normalizedBook = {
          //bookId: {
            //_id: data.book.book_id, // The ID of the newly added book
            //title: data.book.title,
            //author: data.book.author,
            //coverImage: data.book.coverImage,
            //status: "currently-reading",
          //},
          //reviews: [], // New books don't have reviews yet
        //};
        console.log(data.books);
  
  
        //alert("Book added to your currently reading list");
              // Clear search and update the list
         
         // Re-fetch the updated list of books
         fetchBooksWithReviews();

         setQuery(""); // Clear the search bar
         setSearchResults([]); // Clear search results
         //setBooksWithReviews((prevBooks) => [...prevBooks, normalizedBook]); // Update the list with the new book
      } else {
        alert(data.message || "Failed to add book");
        console.log("after adding book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    }
  };
  

  return (
    <div className="my-books-container">
      <h1>My Books</h1>

    <div className="top-right-buttons">
      <Link to="/dashboard" className="home-link">Dashboard</Link>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>


      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar"
        />
        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}
        {message && <p className="message">{message}</p>}
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results</h3>
          <ul className="search-results-list">
            {searchResults.map((book) => (
              <li key={book.id} className="search-result-item">
                <img
                  src={book.image}
                  width="50px"
                  height="50px"
                  alt={book.title}
                  className="book-image"
                />
                <div className="book-details">
                  <strong className="book-title">{book.title}</strong>
                  <p className="book-author">{book.author}</p>
                </div>
                <button
                  className="add-button"
                  onClick={() => handleAddToCurrentlyReading(book)}
                >
                  Add to Currently Reading
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Currently Reading Table */}
      <h2>Your Currently Reading List</h2>
      {booksWithReviews.length > 0 ? (
        <table className="books-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Review</th>
            </tr>
          </thead>
          <tbody>
          {booksWithReviews.map((book) => (
    <tr key={book.bookId?._id || Math.random()}>
      <td>
        <img
          src={book.bookId?.coverImage || "default-image-url.png"}
          width="50px"
          height="50px"
          alt={book.bookId?.title || "No title"}
        />
      </td>
      <td>{book.bookId?.title || "No title available"}</td>
      <td>{book.bookId?.author || "Unknown author"}</td>
      <td>{book.bookId?.status || "N/A"}</td>
      <td>{book.reviews?.length > 0 ? book.reviews[0].rating : "No rating available"}</td>
      <td>
        <button onClick={() => handleWriteReview(book.bookId?._id)}>
          {book.reviews?.length > 0 ? "Edit Review" : "Write a Review"}
        </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books in your currently reading list.</p>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal">
          <Review
            book={selectedBook} // Pass selected book details to Review modal
            onClose={handleCloseReviewModal} // Callback to refresh data on close
          />
        </div>
      )}

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

export default MyBooks;
