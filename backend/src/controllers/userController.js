const z = require("zod");
const { User } = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../../config");

const signupBody = z.object({
  username: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  password: z.string().min(6), // Ensure password is at least 6 characters long
});

const signup = async (req, res) => {
  // Validate request body
  const result = signupBody.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
      errors: result.error.errors,
    });
  }

  const { username, firstName, lastName, password } = req.body;

  // Check if the user already exists
  const userExist = await User.findOne({ username });
  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const user = await User.create({
    username,
    firstName,
    lastName,
    password: hashedPassword,
  });

  const userId = user._id;

  // Generate JWT token
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });

  res.status(201).json({
    message: "User created successfully",
    token: token,
  });
};

const signinBody = z.object({
  username: z.string().email(),
  password: z.string().min(6), // Ensure password is at least 6 characters long
});

const signin = async (req, res) => {
  // Validate request body
  const result = signinBody.safeParse(req.body);
  if (!result.success) {
    return res.status(401).json({
      message: "Please enter correct details",
      errors: result.error.errors,
    });
  }

  const { username, password } = req.body;

  // Find the user by username
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  // Compare the password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({
    message: "Login successful",
    token: token,
  });
};

module.exports = { signup, signin, profilePage };

const profilePage = (req, res) => {};
