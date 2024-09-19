const express = require("express");
const router = express.Router();

const {
  createComment,
  editComment,
  deleteComment,
  getCommentsByPost,
} = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Create a new comment on a post
// POST /api/comments
router.post("/", authMiddleware, createComment);

// Edit an existing comment
// PUT /api/comments/:id
router.put("/:id", authMiddleware, editComment);

// Delete a comment
// DELETE /api/comments/:id
router.delete("/:id", authMiddleware, deleteComment);

// Get all comments for a specific post
// GET /api/comments/post/:postId
router.get("/post/:postId", getCommentsByPost);

module.exports = router;
