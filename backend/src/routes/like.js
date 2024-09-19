const express = require("express");
const {
  likePost,
  unlikePost,
  getPostLikers,
} = require("../controllers/likeController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Like a post
router.post("/likePost/:id", authMiddleware, likePost);

// Unlike a post
router.post("/unlike/:id", authMiddleware, unlikePost);

// Get all users who liked a specific post
router.get("/post/:id/likers", authMiddleware, getPostLikers);

module.exports = router;
