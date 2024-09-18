const mongoose = require("mongoose");

// Post Schema
const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who created the post
  content: { type: String, required: true }, // Content of the post
  imgUrl: { type: String }, // Store the image URL (this will be the S3 URL of the uploaded image)
  likes: { type: Number, default: 0 }, // Number of likes on the post
  comments: { type: Number, default: 0 }, // Number of comments on the post
  createdAt: { type: Date, default: Date.now }, // Date when the post was created
  updatedAt: { type: Date, default: Date.now }, // Date when the post was last updated
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
