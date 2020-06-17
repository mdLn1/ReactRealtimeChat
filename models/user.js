let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { type: String, lowercase: true, required: true },
  password: { type: String, required: true },
  privateRooms: [{ type: Schema.Types.ObjectId, ref: "Rooms" }],
  publicRooms: [{ type: Schema.Types.ObjectId, ref: "Rooms" }],
});

userSchema.statics.isUsernameNotAvailable = async function (username) {
  return (await this.findOne({ username: new RegExp(username, "i") }))
    ? true
    : false;
};

let userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
