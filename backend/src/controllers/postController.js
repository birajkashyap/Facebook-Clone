const AWS = require("aws-sdk");
const { Post } = require("../models/posts");
const { z } = require("zod");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Multer configuration for file handling
const storage = multer.memoryStorage(); // Use memory storage to upload directly to S3
const upload = multer({ storage });

// Zod schema for post validation
const postBody = z.object({
  content: z.string(),
});

// Zod schema for updating post
const updatePostBody = z.object({
  content: z.string(),
});

// Upload Image to S3 function
const uploadToS3 = async (file) => {
  if (!file) throw new Error("No file provided for upload");

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || "fb-bucket-for-practise", // Use env variable for bucket name
    Key: `${Date.now()}_${file.originalname}`, // Generate a unique file name
    Body: file.buffer, // Use buffer to get file data
    ContentType: file.mimetype,
  };

  try {
    return await s3.upload(params).promise(); // Return a promise for async/await
  } catch (err) {
    throw new Error(`S3 upload failed: ${err.message}`);
  }
};

// Create Post with image upload
const createPost = async (req, res) => {
  // Validate request body
  console.log(req.userId); // This should log the user ID of the authenticated user

  const result = postBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Please enter correct details",
      errors: result.error.errors,
    });
  }

  const { content } = req.body;

  try {
    let imgUrl = null;

    // If image is present in the request, upload it to S3
    if (req.file) {
      const s3Result = await uploadToS3(req.file);
      imgUrl = s3Result.Location; // Get the S3 URL of the uploaded image
    }

    // Create a new post associated with the authenticated user
    const newPost = await Post.create({
      userId: req.userId, // Corrected this to match the schema
      content,
      imgUrl, // Store the S3 URL of the image in MongoDB
    });

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit Post
const editPost = async (req, res) => {
  // Validate the request body
  const result = updatePostBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Please enter correct post details",
      errors: result.error.errors,
    });
  }

  try {
    // Find and update the post, ensuring the user is the author
    const updatedPost = await Post.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId }, // Ensure the post belongs to the user
      { content: req.body.content },
      { new: true } // Return the updated post
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found or not updated" });
    }

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete Post
const deletePost = async (req, res) => {
  try {
    // Find and delete the post, ensuring the user is the author
    const deletedPost = await Post.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found or not deleted" });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a Single Post
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "userId",
      "username"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getPost,
  getAllPosts,
  upload, // Export the multer upload for image handling
};
