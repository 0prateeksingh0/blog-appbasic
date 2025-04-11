const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  replies: [this],
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);