import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { authState } from "../../recoil/Authstate";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const auth = useRecoilValue(authState);
  const navigate = useNavigate(); // Use navigate instead of useHistory

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/user/viewProfile",
          {
            headers: {
              Authorization: `Bearer ${auth.token}`, // Include the JWT token
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, [auth.token]);

  const handleSearch = async () => {
    // Implement search functionality
    console.log("Search for:", searchQuery);
  };

  const handleChangePassword = () => {
    console.log("Redirect to Change Password");
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:3000/api/user/delete", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete account");
        }

        console.log("Account deleted successfully");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="flex justify-between w-full mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-md w-full max-w-xs"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2"
        >
          Search
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transition-transform duration-300 hover:shadow-xl">
        <img
          src={user.img}
          alt={`${user.username}'s profile`}
          className="rounded-full w-32 h-32 mb-4 border-4 border-blue-500"
        />
        <h3 className="text-lg font-semibold">{user.username}</h3>
        <p className="text-gray-600">Bio: {user.bio || "No bio available"}</p>
        <div className="flex justify-between mt-4">
          <p className="text-gray-600">Followers: {user.followers}</p>
          <p className="text-gray-600">Following: {user.following}</p>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleChangePassword}
          className="bg-green-500 text-white py-2 px-4 rounded-md mr-2"
        >
          Change Password
        </button>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white py-2 px-4 rounded-md"
        >
          Delete Account
        </button>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md"
      >
        Your Feed
      </button>
    </div>
  );
};

export default Profile;
