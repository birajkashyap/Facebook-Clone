import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./components/Auth/Signin";
import Signup from "./components/Auth/Signup";
import Profile from "./components/Profile/Profile"; // Import the Profile component
import Dashboard from "./components/Dashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Signin />} />
        {/* Add route for Profile */}
        {/* Add more routes here */}
      </Routes>
    </Router>
  );
};

export default App;
