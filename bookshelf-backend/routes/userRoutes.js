const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// API endpoint to validate and create user
router.post("/validateuser", userController.validateUser);


// Search users
router.get('/search', userController.searchUsers);

// Add a friend
router.post("/add-friend", userController.addFriend);

// Fetch friends
router.get('/:userId/friends', userController.getFriends);

module.exports = router;


