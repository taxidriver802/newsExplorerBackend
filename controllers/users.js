const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  StatusBadRequest,
  StatusConflict,
  StatusUnauthorized,
  StatusDefault,
  StatusNotFound
} = require("../utils/StatusError/index");

const createUser = (req, res, next) => {
  const { username, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        username,
        email,
        password: hash,
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send({ token, user: userWithoutPassword }); 
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new StatusBadRequest("Invalid user data"));
      }
      if (err.code === 11000) {
        return next(new StatusConflict("Email already exists"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new StatusBadRequest("Email and password are required"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new StatusUnauthorized("Incorrect email or password"));
      }
      return next(err);
    });
    
};

const getUser = async (req, res, next) => {
  
      try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
          return next(new StatusNotFound("User not found"));
        }
        res.status(200).send(user);
      } catch (err) {
        return next(new StatusDefault("Internal Server Error"));
      }
}

module.exports = {
  createUser,
  login,
  getUser,
};
