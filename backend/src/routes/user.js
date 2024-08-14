const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/userController");

// Route for signup
router.post("/signup", signup);

// Route for signin
router.post("/signin", signin);

module.exports(router);
