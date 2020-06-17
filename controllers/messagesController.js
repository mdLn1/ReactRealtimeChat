const Message = require("../models/message");
const Room = require("../models/room");
const HttpError = require("../utils/httpError");

async function createMessage(req, res) {
  const { message } = req.body;
  const io = req.app.get("io");
  const { room } = req.params;
  const { id, username } = req.user;
  let foundRoom = await Room.findById(room);
  let newMessage = new Message({ message, room, author: username });
  foundRoom.updated_at = new Date();
  await foundRoom.save();
  await newMessage.save();
  io.in(foundRoom.room_name).emit("relay message", {
    message: { ...newMessage._doc },
    room_name: foundRoom.room_name,
  });
  return res.status(200).json({ message: { ...newMessage._doc } });
}

async function deleteMessage(req, res) {
  const { messageId } = req.query;
  const { username } = req.user;
  let message = await Message.findById(messageId);
  if (message.author !== username) {
    throw new HttpError("You are not the author of this message", 400);
  }
  await Message.findByIdAndUpdate(messageId, {
    message: `Deleted by ${username}`,
  });
  return res.status(204).end();
}

module.exports = { createMessage, deleteMessage };
