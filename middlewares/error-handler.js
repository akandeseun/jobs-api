const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    // set deafult
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };

  // Cast Error
  if (err.name === "CastError") {
    customError.msg = `No item found with id ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // Validation Error
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // Duplicate Error
  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
