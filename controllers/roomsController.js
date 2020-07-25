const Room = require("../models/room");
const User = require("../models/user");
const Message = require("../models/message");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");

async function createRoom(req, res) {
  const { roomName, password, private } = req.body;
  const { id } = req.user;
  if (await Room.isRoomNameNotAvailable(roomName))
    throw new HttpError("Room name exists already", 400);
  let user = await User.findById(id);
  if (!user) throw new HttpError("User not found", 400);
  let roomToCreate = { room_name: roomName };
  if (private) {
    if (!password || password.length < 7)
      throw new HttpError(
        "Please choose a secure password between 7 to 100 characters"
      );
    if (password.length > 100)
      throw new HttpError("A password must not exceed 100 characters");
    roomToCreate.private = true;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    roomToCreate.password = hashedPassword;
  }
  let newRoom = new Room({ ...roomToCreate });
  newRoom.users.push(id);
  if (private) {
    user.privateRooms.push(newRoom._id);
  } else {
    user.publicRooms.push(newRoom._id);
  }

  await user.save();
  await newRoom.save();
  return res.status(201).json({ room: { ...newRoom._doc } });
}

async function authorizeRoomEntry(req, res) {
  const { password } = req.body;
  const { roomId } = req.params;
  const { id } = req.user;
  let room = await Room.findById(roomId);
  if (room.users.findIndex((el) => el === id) !== -1)
    throw new HttpError("You have already joined this room!");
  if (!(await bcrypt.compare(password, room.password)))
    throw new HttpError("Sorry! The password you entered is incorrect!");
  let user = await User.findById(id);
  user.privateRooms.push(room._id);
  room.users.push(user._id);
  await room.save();
  await user.save();
  return res.status(204).json();
}

async function joinPublicRoom(req, res) {
  const { roomId } = req.params;
  const { id } = req.user;
  let room = await Room.findById(roomId);
  if (room.private) throw new HttpError("Access not allowed to this room");
  if (!room.users.includes(id)) {
    let user = await User.findById(id);
    user.publicRooms.push(room._id);
    room.users.push(user._id);
    await user.save();
    await room.save();
  }
  const messages = await Message.find({ room: roomId });
  return res.status(200).json({ messages });
}

async function leaveRoom(req, res) {
  const { roomName } = req.body;
  const { id } = req.user;
  let room = await Room.findOne({ room_name: roomName });
  let user = await User.findById(id);
  room.users = room.users.filter((el) => el === user._id);
  if (room.private)
    user.privateRooms = user.privateRooms.filter((el) => el === room._id);
  else user.publicRooms = user.publicRooms.filter((el) => el === room._id);

  await user.save();
  await room.save();
  return res.status(204).end();
}

async function getAllPublicRooms(req, res) {
  return res.status(200).json({
    rooms: await Room.find({ private: false }, "-password -private").populate(
      "users",
      "-password -privateRooms -publicRooms"
    ),
  });
}

async function getUsersPrivateRooms(req, res) {
  const { id } = req.user;
  const rooms = await Room.find(
    { private: true, users: id },
    "-password -private"
  ).populate("users", "-password -privateRooms -publicRooms");
  return res.status(200).json({
    rooms,
  });
}

async function getRoomMessages(req, res) {
  const { roomId } = req.params;
  let { pageNo, pageSize } = req.query;
  if (!pageNo) pageNo = 1;
  else pageNo = Number.parseInt(pageNo);
  if (!pageSize) pageSize = 10;
  else pageSize = Number.parseInt(pageSize);
  let id;
  if (req.user) id = req.user.id;
  let room = await Room.findById(roomId);

  if (!room) {
    throw new HttpError("Room does not exist", 400);
  }
  if (room.private && !room.users.includes(id)) {
    throw new HttpError(
      "You must join a private room before accessing its data"
    );
  }

  let messages = await Message.find({ room: roomId })
    .sort({ created_at: -1 })
    .skip((pageNo - 1) * pageSize)
    .limit(pageSize);
  messages.reverse();
  return res.status(200).json({ messages });
}

module.exports = {
  createRoom,
  authorizeRoomEntry,
  getAllPublicRooms,
  leaveRoom,
  joinPublicRoom,
  getRoomMessages,
  getUsersPrivateRooms,
};
