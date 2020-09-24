const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const mongoConnect = require("./utils/mongoConnect");
const CLIENT_ORIGIN = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
];
const cors = require("cors");
const app = express();
const xss = require("xss-clean");
const compression = require("compression");
const helmet = require("helmet");
const path = require("path");

app.use(compression());
app.use(helmet());
app.use(xss());
app.use(express.json({ extended: true }));
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);
mongoConnect();

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' 'unsafe-inline' https://fonts.gstatic.com https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: ; "
  );
  return next();
});

const server = http.createServer(app);

const io = socketIO(server);
app.set("io", io);
app.use(express.static(path.join(__dirname, "/client/build")));

app.use("/api/room", require("./routes/roomsRoute"));
app.use("/api/user", require("./routes/usersRoute"));
app.use("/api/message", require("./routes/messageRoute"));

app.use((req, res, next) => {
  res.status(404).json({ errors: "Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.statusCode ? err.statusCode : 500)
    .json({ errors: Array.isArray(err.message) ? err.message : [err.message] });
});

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("send message", (message) => {
    io.sockets.emit("relay message", message);
  });

  socket.on("room message", (message, roomName) => {
    io.in(roomName).emit("group message", message);
  });

  socket.on("join room", (roomName) => {
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Listening on port ${process.env.PORT || 5000}`)
);
