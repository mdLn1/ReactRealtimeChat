const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const exceptionHandler = require("../utils/exceptionHandler");
const errorChecker = require("../middleware/errorCheckerMiddleware");
const authenticationMiddleware = require("../middleware/authenticationMiddleware");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");
const {
  createRoom,
  authorizeRoomEntry,
  getAllPublicRooms,
  leaveRoom,
  joinPublicRoom,
  getRoomMessages,
  getUsersPrivateRooms,
} = require("../controllers/roomsController");

//@route GET api/room/
//@desc Get all public rooms
//@access Public
router.get("/", exceptionHandler(getAllPublicRooms));

//@route GET api/room/private
//@desc Get user's private rooms
//@access Public
router.get(
  "/private",
  [authenticationMiddleware],
  exceptionHandler(getUsersPrivateRooms)
);

//@route POST api/room/
//@desc Create new room
//@access Private
router.post(
  "/",
  [
    authenticationMiddleware,
    check(
      "roomName",
      "Room name must be at least 5 characters long and maximum 35"
    )
      .trim()
      .isLength({ min: 5, max: 35 }),
    check(
      "private",
      "You must mention whether you want a public or a private room"
    ).isBoolean(),
    errorChecker,
  ],
  exceptionHandler(createRoom)
);

//@route POST api/room/entry
//@desc Attempt to access the data in a private room
//@access Private
router.post(
  "/:roomId/entry",
  [
    authenticationMiddleware,
    check("password", "A password must be provided").exists(),
    errorChecker,
  ],
  exceptionHandler(authorizeRoomEntry)
);

//@route GET api/room/:roomId/join
//@desc Join a public room
//@access Private
router.get(
  "/:roomId/join",
  [authenticationMiddleware],
  exceptionHandler(joinPublicRoom)
);

//@route GET api/room/:roomId
//@desc Access the data in a public room
//@access Private/Public
router.get(
  "/:roomId",
  [optionalAuthMiddleware],
  exceptionHandler(getRoomMessages)
);

//@route POST api/room/leave
//@desc Leave a room
//@access Private
router.post(
  "/leave",
  [
    authenticationMiddleware,
    check(
      "roomName",
      "Room name must be at least 5 characters long and maximum 35"
    )
      .trim()
      .isLength({ min: 5, max: 35 }),
    errorChecker,
  ],
  exceptionHandler(leaveRoom)
);

module.exports = router;
