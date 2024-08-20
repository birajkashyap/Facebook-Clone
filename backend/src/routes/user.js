const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

const {
  signup,
  signin,
  update,
  viewProfile,
} = require("../controllers/userController");

// Route for signup
router.post("/signup", signup);

// Route for signin
router.post("/signin", signin);
router.put("/update", authMiddleware, update);
router.get("/viewProfile", viewProfile);

module.exports = router;
