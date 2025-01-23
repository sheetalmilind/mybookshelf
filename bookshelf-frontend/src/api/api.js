import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your backend URL

export const loginUser = async (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

export const registerUser = async (data) => {
  return axios.post(`${API_URL}/auth/register`, data);
};

export const getUserProfile = async (token) => {
  return axios.get(`${API_URL}/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getBookshelfData = async (token) => {
  return axios.get(`${API_URL}/bookshelf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addBookToShelf = async (data) => {
  return axios.post(`${API_URL}/bookshelf`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};

export const addReview = async (data) => {
  return axios.post(`${API_URL}/review`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};

export const getSocialFeed = async (token) => {
  return axios.get(`${API_URL}/social/feed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getRecommendations = async () => {
  return axios.get(`${API_URL}/recommendations`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};

export const getBookDetails = async (bookId) => {
  return axios.get(`${API_URL}/books/${bookId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};
