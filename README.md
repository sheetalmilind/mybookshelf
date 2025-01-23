# mybookshelf
# MyBooks Application

The **MyBooks Application** is a book management app that allows users to:
- Search for books using a search bar.
- Add books to their "Currently Reading" list.
- View books they are currently reading, along with associated reviews and ratings.
- Write or edit reviews for books.

---

## Features

### 1. **Search for Books**
- A search bar enables users to search for books by title or author.
- Fetches books from a backend API and displays search results with book details and an image.

### 2. **Add to "Currently Reading"**
- Users can add a book to their "Currently Reading" list from the search results.
- Books are saved to the database and displayed in the "Currently Reading" section.

### 3. **View Books with Reviews**
- Displays books the user is currently reading along with their reviews and ratings.
- Allows users to view or edit reviews.

### 4. **Write or Edit Reviews**
- Users can write a new review or update an existing one for a book.

---

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server (Refer to the backend repository for setup instructions)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/mybooks-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd mybooks-app
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

5. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Backend Setup

The application depends on a backend server for fetching book data and managing user reviews. Ensure the backend server is running locally at `http://localhost:5000`. Refer to the backend repository for more details.

---

## Folder Structure

```
mybooks-app/
├── public/
├── src/
│   ├── components/
│   │   ├── MyBooks.js      # Main component for book management
│   │   ├── Review.js       # Modal component for reviews
│   ├── styles/
│   │   ├── MyBooks.css     # CSS for the MyBooks component
│   ├── App.js              # Entry point for the app
│   ├── index.js            # Main render file
├── package.json
└── README.md
```

---

## API Endpoints

### Backend API

#### 1. Search Books
- **Endpoint**: `GET /api/books/search?query=<search-term>`
- **Description**: Returns a list of books matching the search term.

#### 2. Get Books with Reviews
- **Endpoint**: `GET /api/books/get-books-with-reviews/:userId`
- **Description**: Fetches books along with their reviews for a specific user.

#### 3. Add Book to User's Reading List
- **Endpoint**: `POST /api/books/addBookUser`
- **Payload**:
  ```json
  {
    "userId": "<user-id>",
    "title": "<book-title>",
    "author": "<book-author>",
    "description": "<book-description>",
    "coverImage": "<image-url>"
  }
  ```

#### 4. Update Book Rating
- **Endpoint**: `PATCH /api/socialcard/reviews/update-rating/:bookId`
- **Payload**:
  ```json
  {
    "rating": <rating-value>
  }
  ```

---

## Troubleshooting

### Common Issues
1. **Search Results Not Displaying**:
   - Check if the backend server is running.
   - Ensure the API URL in `MyBooks.js` matches your backend server URL.

2. **Error Adding Book**:
   - Inspect the API response using the browser console.
   - Ensure the backend API is returning the expected structure.

3. **CORS Issues**:
   - Enable CORS on the backend server.

---

## Contributing

Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push the branch.
4. Open a pull request with a detailed description of your changes.

---

## License

This project is licensed under the [MIT License](LICENSE).

