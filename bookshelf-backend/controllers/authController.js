const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//exports.registerUser = async (req, res) => {
  //try {
  //  const { username, email, password } = req.body;
   // const user = new User({ username, email, password });
   // await user.save();
   // res.status(201).json({ message: 'User registered successfully' });
  //} catch (err) {
   // res.status(500).json({ message: 'Error registering user', error: err });
  //}
//};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //console.log(user.email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    //let passwordHash = await bcrypt.hash(password, 10);
   //const booleanResult = await bcrypt.compare(userData.password, passwordHash);
    const isPasswordValid = await bcrypt.compare(password,user.password);
    

    //console.log(isPasswordValid);
    //console.log(user.password);
    if (!isPasswordValid) 
      return res.status(401).json({ message: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({
      message: 'Login successful',
      user: { id: user._id, username: user.email,name:user.name },
      token: token
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};


exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate the request
  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and new password are required." });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

