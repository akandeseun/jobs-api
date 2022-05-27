const User = require("../models/User");
require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors/errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  // const { name, email, password } = req.body;
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please Provide Login details");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Login Credentials");
  }

  // check/verify password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Login Credentials");
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
  // res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  register,
  login,
};
