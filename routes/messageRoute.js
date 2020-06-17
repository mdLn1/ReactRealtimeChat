const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");

const {
  createMessage,
  deleteMessage,
} = require("../controllers/messagesController");

//@route POST api/message/:room
//@desc Create a message
//@access Private
router.post(
  "/:room",
  [
    authenticationMiddleware,
    check("room", "An id for a room must be provided").exists(),
    errorChecker,
  ],
  exceptionHandler(createMessage)
);

//@route DELETE api/message/:messageId
//@desc Delete a message
//@access Private
router.post(
  "/:messageId",
  [
    authenticationMiddleware,
    check("messageId", "An id for a message must be provided").exists(),
    errorChecker,
  ],
  exceptionHandler(deleteMessage)
);

module.exports = router;
