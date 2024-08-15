const express = require("express");
const router = express.Router();
const { signup, signin, update } = require("../controllers/userController");

// Route for signup
router.post("/signup", signup);

// Route for signin
router.post("/signin", signin);
router.put("/update", update);

module.exports(router);
