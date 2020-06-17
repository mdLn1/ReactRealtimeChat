const User = require("../models/user");
const HttpError = require("../utils/httpError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createUser(req, res) {
  const { username, password } = req.body;
  if (await User.isUsernameNotAvailable(username))
    throw new HttpError("username exists already", 400);
  if (password.length < 7)
    throw new HttpError("Please choose a more secure password");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let newUser = new User({ username: username, password: hashedPassword });
  await newUser.save();
  const payload = { user: { username: newUser.username, id: newUser._id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (!token) throw new Error("Could not create token, please try again later");

  return res.status(201).json({ user: { username: username }, token });
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw new HttpError(
      "Invalid credentials, please make sure you typed everything correctly",
      400
    );
  const payload = { user: { username: user.username, id: user._id } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (!token) throw new Error("Could not create token, please try again later");

  res.status(200).json({ user: { username: user.username }, token });
}

module.exports = { createUser, loginUser };
