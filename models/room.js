let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let roomSchema = new Schema({
  room_name: {
    type: String,
    required: true,
    unique: true,
  },
  private: { type: Boolean, default: false },
  password: { type: String },
  users: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  created_at: { type: Date },
  updated_at: { type: Date },
});

roomSchema.statics.isRoomNameNotAvailable = async function (roomName) {
  return (await this.findOne({ room_name: new RegExp(roomName, "i") }))
    ? true
    : false;
};

roomSchema.pre("save", function (next) {
  this.updated_at = new Date();
  if (!this.created_at) this.created_at = new Date();
  next();
});

let roomModel = mongoose.model("Rooms", roomSchema);

module.exports = roomModel;
