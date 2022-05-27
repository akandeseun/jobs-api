require("dotenv").config();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name must be provided"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    minlength: 3,
    maxlength: 50,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password must be provided"],
    minlength: 6,
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.createJWT = function () {
  const secret = process.env.JWT_SECRET;
  const lifetime = process.env.JWT_LIFETIME;

  return jwt.sign({ userId: this._id, name: this.name }, secret, {
    expiresIn: lifetime,
  });
};

UserSchema.methods.comparePassword = async function (userPassword) {
  const compared = await bcrypt.compare(userPassword, this.password);

  return compared;
};

module.exports = mongoose.model("User", UserSchema);
