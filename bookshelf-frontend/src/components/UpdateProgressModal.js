import React, { useState } from 'react';
import '../styles/UpdateProgressModal.css';

const UpdateProgressModal = ({ book, onClose, onProgressUpdated }) => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [progress, setProgress] = useState(book.progress || 0);
  const [comment, setComment] = useState('');

  const handleSaveProgress = async () => {
    const userId = localStorage.getItem('id');

   

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/update-progress/${userId}/${book._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress, comment }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Progress updated:', data);
        onProgressUpdated({ ...book, progress }); // Pass updated book details back to parent
      } else {
        console.error(data.message || 'Failed to update progress');
      }
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const fetchBookProgress = async (userId, bookId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/books/progress/${userId}/${bookId}`);
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
  

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Update Progress for {book.title}</h3>
        <input
          type="number"
          placeholder="Progress (%)"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
        />
        <textarea
          placeholder="Optional comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <div className="modal-actions">
          <button onClick={handleSaveProgress}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProgressModal;
