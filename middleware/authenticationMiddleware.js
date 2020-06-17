const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");
require("dotenv").config();

module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      throw new HttpError(
        "You must be authenticated to perform this action",
        400
      );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    next(err);
  }
};
