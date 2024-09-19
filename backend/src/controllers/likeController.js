const { Post } = require("../config/db");
const { User } = require("../config/db");

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure likedBy array is initialized
    if (!post.likedBy) {
      post.likedBy = [];
    }

    // Check if the user has already liked the post
    if (post.likedBy.includes(req.userId)) {
      return res
        .status(400)
        .json({ message: "You have already liked this post" });
    }

    // Add user to likedBy array and increment likes
    post.likedBy.push(req.userId);
    post.likes += 1;

    await post.save();

    res.status(200).json({ message: "Post liked", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//http://localhost:3000/api/like/likePost/66eb12949ad15cf86343e3a9

// Unlike a post
const unlikePost = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from request params
    const userId = req.userId; // Get user ID from the auth middleware

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has liked the post
    if (!post.likedBy.includes(userId)) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    // Remove user ID from the post's likedBy array
    post.likedBy = post.likedBy.filter((like) => like.toString() !== userId);

    // Decrement the likes count
    post.likes = post.likedBy.length;

    await post.save(); // Save the updated post

    res.status(200).json({ message: "Post unliked successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//http://localhost:3000/api/like/unlike/66eb12949ad15cf86343e3a9

// Get all users who liked a specific post
const getPostLikers = async (req, res) => {
  try {
    const postId = req.params.id; // Get post ID from the request params

    // Find the post and populate the 'likedBy' field with user details (e.g., username and email)
    const post = await Post.findById(postId).populate(
      "likedBy",
      "username email"
    ); // Assuming 'likedBy' is an array of User IDs

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the list of users who liked the post
    res.status(200).json({
      message: "Post likers retrieved successfully",
      likers: post.likedBy, // This contains user details who liked the post
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//http://localhost:3000/api/like/post/66eb12949ad15cf86343e3a9/likers

module.exports = {
  likePost,
  unlikePost,
  getPostLikers,
};
