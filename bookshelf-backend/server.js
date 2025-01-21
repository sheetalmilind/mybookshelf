const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/auth');
const bookRoutes = require("./routes/book");
const bookshelfRoutes = require('./routes/bookshelf');
//const socialRoutes = require('./routes/social');
const recommendationsRoutes = require('./routes/recommendations');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, "build")));



//app.get('/',(req,res) =>{res.send('hello root node')});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookshelf', bookshelfRoutes);
//app.use('/api/social', socialRoutes);
app.use('/api/recommendations', recommendationsRoutes);
app.use('/api/books', bookRoutes); // Use the book routes under the /api/books path
app.use('/api',userRoutes);
app.use('/api/users',userRoutes);


app.use('/api/socialcard', reviewRoutes);
// Use the social card routes
//app.use('/api/social-cards', socialcardRoutes);

// Serve index.html for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});


// Routes
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/BookShelf2',{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB')
}).catch(error =>{
 console.log('There was connection error');
})




//mongoose
 // .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
 // .then(() => console.log('MongoDB connected'))
 // .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
