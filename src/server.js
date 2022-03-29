const http = require("http");
const Filter = require("bad-words");
const app = require("./app.js");
const {
  getUser,
  removeUser,
  addUser,
  getUsersInRoom,
} = require("./utils/users");

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);
const io = require("socket.io")(server);

function sendText(text, user) {
  return { text, user, createdAt: new Date().getTime() };
}

/*
SOCKET.EMIT => emits to a specific client
IO.EMIT => emits to all clients
SOCKET.BROADCAST.EMIT => emits to all except the socket
IO.TO.EMIT => emit to all in specific room
SOCKET.BROADCAST.TO.EMIT => emit to all in specific room except to the socket
*/
io.on("connection", (socket) => {
  console.log("WebSocket connection");

  // socket.emit("message", sendText("Welcome!"));
  // socket.broadcast.emit("message", sendText("A new user has joined!"));
  socket.on("join", (data, cb) => {
    const { error, user } = addUser({ id: socket.id, ...data });
    if (error) {
      return cb(error);
    }
    socket.join(user.room);

    socket.emit("message", sendText("Welcome!", user.username));
    socket.broadcast
      .to(user.room)
      .emit("message", sendText(`${user.username} has joined!`, user.username));
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    return cb();
  });

  socket.on("sendMessage", (message, cb) => {
    const filter = new Filter();
    const user = getUser(socket.id);
    if (filter.isProfane(message)) {
      return cb(sendText("Profanity is not allowed!", user.username));
    }

    // console.log(user);
    io.to(user.room).emit("message", sendText(message, user.username));
    return cb();
  });

  socket.on("sendLocation", (location, cb) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      sendText(
        `https://google.com/maps?q=${location.lat},${location.lon}`,
        user.username
      )
    );
    return cb();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        sendText(`${user.username} has left`, user.username)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () => console.log(`server listining on port: ${PORT}`));
