const express = require("express");

const { login, createUser, getUser } = require("../controllers/users");

const router = express.Router();

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// Routes
router.get("/users/me", getUser);

// Handle unknown routes
router.use((req, res, next) => {
  next(new StatusNotFound("The requested resource was not found"));
});

module.exports = router;
