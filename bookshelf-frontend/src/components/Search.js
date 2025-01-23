import React, { useState } from "react";

const Search= () => {
  const [query, setQuery] = useState(""); // Search query
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error message

  // Function to handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search term.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/books/search?query=${query}`);
      if (!response.ok) {
        throw new Error("Failed to fetch books. Please try again later.");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle adding a book
  const handleAddBook = async (book) => {
    try {
      const response = await fetch("/api/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: book.title,
          author: book.author,
          description: book.description,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Book added successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Search and Add Books</h2>
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search for a book..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: "10px", width: "80%" }}
        />
        <button onClick={handleSearch} style={{ padding: "10px", marginLeft: "10px" }}>
          Search
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {searchResults.length > 0 && (
          <div>
            <h3>Search Results:</h3>
            <ul>
              {searchResults.map((book, index) => (
                <li key={index} style={{ marginBottom: "20px" }}>
                  <strong>{book.title}</strong> by {book.author}
                  <p>{book.description}</p>
                  <button onClick={() => handleAddBook(book)} style={{ padding: "5px 10px" }}>
                    Add to Bookshelf
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
