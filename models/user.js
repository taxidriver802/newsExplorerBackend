const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "The name is required."],
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: [true, "The email is required."],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email",
    },
  },
  password: {
    type: String,
    required: [true, "The password is required."],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        /* throw new StatusUnauthorized("Incorrect email or password"); */
        console.log("incorrect email or password");
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          /* throw new StatusUnauthorized("Incorrect email or password"); */
          console.log("incorrect email or password");
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
