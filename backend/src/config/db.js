const mongoose = require("mongoose");
const { User, Like, FriendRequest, Post, Comment } = require("../models");

// MongoDB connection string with a specific database name
mongoose.connect(
  "mongodb+srv://birajkashyap:S@hil_2003@cluster0.iwwj2uo.mongodb.net/facebook_clone_db",
  { useNewUrlParser: true, useUnifiedTopology: true }
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
