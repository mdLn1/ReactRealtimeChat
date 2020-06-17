let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let messageSchema = new Schema({
  message: { type: String, required: true },
  room: { type: Schema.Types.ObjectId, ref: "Rooms" },
  author: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

let messageModel = mongoose.model("Messages", messageSchema);

module.exports = messageModel;
