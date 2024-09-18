const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Retrieve the Authorization header

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ msg: "Verification error" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token part after 'Bearer'

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token using the secret

    req.userId = decoded.userId; // Attach the decoded userId to req

    next(); // Move to the next middleware
  } catch (err) {
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = {
  authMiddleware,
};
