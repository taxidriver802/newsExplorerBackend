const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "Authorization required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = payload; // Attach user payload to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;