const { Comment } = require("../models/comment");
const { Post } = require("../models/posts");

// Create a Comment
const createComment = async (req, res) => {
  const { postId, text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const newComment = await Comment.create({
      postId,
      userId: req.userId, // Ensure user is authenticated
      text,
    });

    // Increment the comment count on the post
    post.comments += 1;
    await post.save();

    res.status(201).json({
      message: "Comment created successfully",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit a Comment
const editComment = async (req, res) => {
  const { text } = req.body;
  const commentId = req.params.id;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    // Find and update the comment, ensuring the user is the author
    const updatedComment = await Comment.findOneAndUpdate(
      { _id: commentId, userId: req.userId },
      { text, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedComment) {
      return res
        .status(404)
        .json({ message: "Comment not found or not updated" });
    }

    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a Comment
const deleteComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    // Find and delete the comment, ensuring the user is the author
    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      userId: req.userId,
    });

    if (!deletedComment) {
      return res
        .status(404)
        .json({ message: "Comment not found or not deleted" });
    }

    // Decrement the comment count on the post
    const post = await Post.findById(deletedComment.postId);
    post.comments -= 1;
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Comments for a Post
const getCommentsByPost = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await Comment.find({ postId }).populate(
      "userId",
      "username"
    );

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this post" });
    }

    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createComment,
  editComment,
  deleteComment,
  getCommentsByPost,
};
