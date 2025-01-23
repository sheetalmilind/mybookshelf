const User = require("../models/User");
const bcrypt = require("bcryptjs");

const validateUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate if the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if user exists in the database
    const user = await User.findOne({ email });
    //console.log(user.password);
    if (user) {
      // If user exists, send a response saying the user already exists
      return res.status(400).json({ message: "User already exists" });
    } else {
      // If user does not exist, hash the password and create the user
      //console.log(password);
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword, // Save the hashed password
      });

      // Save the new user to the database
      await newUser.save();

      // Return a success message
      return res.status(201).json({ message: "User created successfully" });
    }
  } catch (err) {
    console.error("Error during user creation:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// controllers/userController.js
const addFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;
    console.log("in usercontroller");
    // Ensure the friend is not already in the friends list
    const user = await User.findById(userId);
    console.log(user);
    const isAlreadyFriend = user.friends.some((friend) => friend.friendId.toString() === friendId);

    if (isAlreadyFriend) {
      return res.status(400).json({ message: 'User is already your friend' });
    }

    // Add the friend to the user's friends list
    user.friends.push({ friendId });
    await user.save();

    res.status(200).json({ message: 'Friend added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add friend' });
  }
};

// Search for users by name or email
const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    //const userId = req.user.id; // Assume req.user contains the authenticated user's info

    // Search for users, excluding the current user
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ],
      //_id: { $ne: userId }
    }).select('_id name email');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to search users' });
  }
};

// Fetch friends list with user details
const getFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user document
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the friend IDs
    const friendIds = user.friends.map((friend) => friend.friendId);

    // Query the User collection for the friend details
    const friends = await User.find({ _id: { $in: friendIds } }).select('name email profilePicture');

    // Map the friends to include their status from the user's document
    const friendsWithStatus = friends.map((friend) => {
      const friendData = user.friends.find((f) => f.friendId.toString() === friend._id.toString());
      return {
        _id: friend._id,
        name: friend.name,
        email: friend.email,
        profilePicture: friend.profilePicture,
        status: friendData?.status || 'unknown',
      };
    });

    res.status(200).json(friendsWithStatus);
  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  validateUser,addFriend,searchUsers,getFriends,
};
