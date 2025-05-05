const express = require("express");

const { StatusNotFound } = require("../utils/StatusError/index");
const { login, createUser, getUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const router = express.Router();

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// Routes
router.get("/users/me", auth, getUser);

// Handle unknown routes
router.use((req, res, next) => {
  next(new StatusNotFound("The requested resource was not found"));
});

module.exports = router;
