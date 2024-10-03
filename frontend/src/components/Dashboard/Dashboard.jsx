import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil/Authstate";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const auth = useRecoilValue(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/post/getAllPosts",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (response.status === 401) {
          navigate("/signin");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      }
    };

    if (auth.token) {
      fetchPosts();
    } else {
      navigate("/signin");
    }
  }, [auth.token, navigate]);

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("content", newPostContent);

    // Append the image only if it's selected
    if (newPostImage) {
      formData.append("file", newPostImage);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/api/post/createPost",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          body: formData,
        }
      );

      const { post } = await response.json();

      // Handle success, e.g., refresh the feed or clear the form
      setPosts((prevPosts) => [post, ...prevPosts]); // Add new post to the top
      setNewPostContent("");
      setNewPostImage(null);
    } catch (err) {
      console.error("Error creating post:", err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/post/deletePost/${postId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        setPosts(posts.filter((post) => post._id !== postId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleImageChange = (e) => {
    setNewPostImage(e.target.files[0]);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User Feed</h2>

      {/* Post creation section */}
      <div className="mb-4">
        <textarea
          rows="3"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's on your mind?"
          className="border p-2 rounded-md w-full"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
        <button
          onClick={handleCreatePost}
          className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Post
        </button>
      </div>

      {/* Displaying posts */}
      <div>
        {posts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-4 rounded-lg shadow-md mb-4"
          >
            <h3 className="font-semibold">{post.userId.username}</h3>
            <p>{post.content}</p>
            {post.imgUrl && (
              <img
                src={post.imgUrl}
                alt="Post image"
                className="mt-2 max-w-full h-auto rounded-md object-cover" // Adjusted classes
                style={{ maxHeight: "300px" }} // Set a max height for the image
              />
            )}
            <button
              onClick={() => handleDeletePost(post._id)}
              className="mt-2 bg-red-500 text-white py-1 px-3 rounded-md"
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
