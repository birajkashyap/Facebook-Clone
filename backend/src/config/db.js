const mongoose = require("mongoose");
const { User } = require("../models/user");
const { Like } = require("../models/like");
const { Post } = require("../models/posts");
const { Comment } = require("../models/comment");
const { FriendRequest } = require("../models/friendRequest");

// MongoDB connection string with a specific database name
mongoose.connect(
  "mongodb+srv://birajkashyap:S%40hil_2003@cluster0.iwwj2uo.mongodb.net/facebook"
);

// Handling connection events
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB:", err);
});

module.exports = {
  User,
  Like,
  Post,
  Comment,
  FriendRequest,
};
