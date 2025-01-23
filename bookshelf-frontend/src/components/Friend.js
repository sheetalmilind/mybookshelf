import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FriendsPage = () => {
  const SERVER_URL = process.env.REACT_APP_SERVER_URL;
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const userId = localStorage.getItem('id'); // Assuming user_id is stored in localStorage

  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate("/dashboard"); // Assuming "/dashboard" is the route for the Dashboard
  };




  // Fetch friends list on page load
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/${userId}/friends`);
      setFriends(response.data); // Assume response.data contains the array of friends
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/users/search?query=${searchQuery}`);
      setSearchResults(response.data); // Assume response.data contains the array of user search results
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const addFriend = async (friendId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/users/add-friend`, {
        userId,
        friendId,
      });

      if (response.status === 200) {
        setMessage('Friend added successfully!');
        fetchFriends(); // Refresh the friends list
        setSearchResults([]); // Clear search results
        setSearchQuery(''); // Clear the search bar
      }
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
        <header className="friends-header">
        <button className="home-button" onClick={goToDashboard}>
          Home
        </button>
        
      </header>

      <h1>Find a Friend</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Find a friend by name or email"
          style={{
            padding: '10px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginRight: '10px',
          }}
        />
        <button
          onClick={searchUsers}
          style={{
            padding: '10px 20px',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Search Members
        </button>
      </div>

      {message && <p style={{ color: 'green' }}>{message}</p>}

      {/* Search results */}
      {searchResults.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Search Results:</h3>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {searchResults.map((user) => (
              <li
                key={user._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  padding: '10px',
                }}
              >
                <img
                  src={user.profilePicture || 'https://via.placeholder.com/50'}
                  alt={user.name}
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>{user.name}</h3>
                  <p style={{ margin: 0, color: 'gray' }}>{user.email}</p>
                </div>
                <button
                  onClick={() => addFriend(user._id)}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Add Friend
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends list */}
      <h2>My Friends</h2>
      {friends.length === 0 ? (
        <p>You have no friends added yet.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {friends.map((friend) => (
            <li
              key={friend._id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '10px',
              }}
            >
              <img
                src={friend.profilePicture || 'https://via.placeholder.com/50'}
                alt={friend.name}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{friend.name}</h3>
                <p style={{ margin: 0, color: 'gray' }}>{friend.email}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsPage;
