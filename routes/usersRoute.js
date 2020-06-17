const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const { createUser, loginUser } = require("../controllers/usersControler");

//@route POST api/user/register
//@desc Register new user
//@access Public
router.post(
  "/register",
  [
    check(
      "username",
      "Username must be at least 5 characters long and maximum 26"
    )
      .trim()
      .isLength({ min: 5, max: 26 }),
    check(
      "password",
      "Password must be at least 7 characters long and maximum 100"
    )
      .trim()
      .isLength({ min: 7, max: 100 }),
    errorChecker,
  ],
  exceptionHandler(createUser)
);

//@route POST api/user/login
//@desc Login existing user
//@access Public
router.post(
  "/login",
  [
    check("username", "Invalid username").trim().isLength({ min: 5, max: 26 }),
    check("password", "Invalid password").trim().isLength({ min: 7, max: 100 }),
    errorChecker,
  ],
  exceptionHandler(loginUser)
);

module.exports = router;
