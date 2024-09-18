const express = require("express");
const {
  createPost,
  editPost,
  deletePost,
  getPost,
  getAllPosts,
  upload,
} = require("../controllers/postController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply the authMiddleware to protect post-related routes
router.post("/createPost", authMiddleware, upload.single("file"), createPost);
router.put("/editPost/:id", authMiddleware, editPost);
router.delete("/deletePost/:id", authMiddleware, deletePost);
router.get("/getPost/:id", authMiddleware, getPost);
router.get("/getAllPosts", authMiddleware, getAllPosts);

module.exports = router;
