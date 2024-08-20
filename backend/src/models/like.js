const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Post model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the date when the like is created
  },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = { Like };
