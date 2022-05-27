const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors/errors");

const authentication = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  } else {
    // splitting the auth header to fetch the token
    const fullauth = authHeader.split(" ");
    const token = fullauth[1];

    // verify token
    const secret = process.env.JWT_SECRET;
    try {
      const decoded = jwt.verify(token, secret);
      req.user = { userId: decoded.userId, name: decoded.name };
      next();
    } catch (error) {
      throw new UnauthenticatedError("Invalid Token");
    }
  }
};

module.exports = authentication;
