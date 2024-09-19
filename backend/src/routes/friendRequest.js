const express = require("express");
const router = express.Router();
const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
} = require("../controllers/friendRequestController");
const { authMiddleware } = require("../middlewares/authMiddleware"); // Assuming you're using authentication middleware

// Send a friend request
// POST /api/friend-requests
router.post("/", authMiddleware, sendFriendRequest);

// Accept a friend request
// PUT /api/friend-requests/accept/:requestId
router.put("/accept/:requestId", authMiddleware, acceptFriendRequest);

// Reject a friend request
// PUT /api/friend-requests/reject/:requestId
router.put("/reject/:requestId", authMiddleware, rejectFriendRequest);

// Get all pending friend requests for the user
// GET /api/friend-requests
router.get("/", authMiddleware, getFriendRequests);

module.exports = router;
