const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const BookSchema = new mongoose.Schema({
  book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['currently-reading', 'finished', 'want-to-read'], required: true },
  progress: { type: Number, default: 0 }, // Percentage progress, e.g., 0-100
  comment: { type: String, default: '' },
});


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true ,maxlength:60},
  books: [BookSchema], // Array of book objects
  friends: [
    {
      friendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }
  ], // List of friend user IDs
  posts: [
    {
      book_id: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      review: { type: String },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],

}, { timestamps: true });
  //friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

//UserSchema.pre('save', async function (next) {
 // if (!this.isModified('password')) return next();
 // this.password = await bcrypt.hash(this.password, 10);
 // next();
//});
//console.log(this.password);
const User = mongoose.model("User", UserSchema);

module.exports = User;
