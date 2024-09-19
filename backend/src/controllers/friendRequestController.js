const { FriendRequest } = require("../models/friendRequest");
const { User } = require("../models/user");

// Send a Friend Request
const sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.userId; // Assuming `req.userId` is from the auth middleware

  try {
    // Check if the friend request already exists
    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
    });

    res.status(201).json({
      message: "Friend request sent successfully",
      friendRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Accept a Friend Request
const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const receiverId = req.userId;

  try {
    // Find the friend request
    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      receiverId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Update the request status to accepted
    friendRequest.status = "accepted";
    await friendRequest.save();

    res.status(200).json({
      message: "Friend request accepted",
      friendRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject a Friend Request
const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const receiverId = req.userId;

  try {
    // Find the friend request
    const friendRequest = await FriendRequest.findOne({
      _id: requestId,
      receiverId,
      status: "pending",
    });

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Update the request status to rejected
    friendRequest.status = "rejected";
    await friendRequest.save();

    res.status(200).json({
      message: "Friend request rejected",
      friendRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Friend Requests for a User
const getFriendRequests = async (req, res) => {
  const userId = req.userId;

  try {
    // Find all friend requests where the user is the receiver
    const friendRequests = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "username email");

    res.status(200).json({ friendRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
};
