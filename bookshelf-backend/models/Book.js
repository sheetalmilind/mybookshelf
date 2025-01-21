const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  averageRating: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // Progress in percentage
  comment: { type: String, default: '' },
  status: { type: String, enum: ['currently-reading', 'finished'], default: 'currently-reading' },
 // pages: {type: Number,default: 200},
});

module.exports = mongoose.model('Book', BookSchema);
