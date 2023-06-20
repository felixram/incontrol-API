const CustomAPIError = require("./custom-errors");
const UnauthenticatedError = require("./unauthenticated");
const BadRequestError = require("./bad-request");
const NotFoundError = require("./not-found");

module.exports = {
  CustomAPIError,
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
};
