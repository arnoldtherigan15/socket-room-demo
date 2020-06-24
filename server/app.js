const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const server = require("http").Server(app);
const io = require("socket.io")(server);

let rooms = [];
// {
//     name: '',
//     users: [],
//     admin: ''
// }

io.on("connection", (socket) => {
  socket.on("login", (data) => {
    socket.emit("get-rooms", rooms);
  });
  socket.on("create-room", (data) => {
    let room = {
      name: data["room-name"],
      users: [],
      admin: data.admin,
    };
    rooms.push(room);
    io.emit("updated-room", rooms);
  });
  socket.on("join-room", (data) => {
    socket.join(data["room-name"], function () {
      let roomIndex = rooms.findIndex((i) => i.name == data["room-name"]);
      rooms[roomIndex].users.push(data.username);
      io.sockets.in(data["room-name"]).emit("room-detail", rooms[roomIndex]);
    });
  });
  socket.on("start-game", (data) => {
    socket.broadcast.to(data).emit("start-game");
  });
});

server.listen(PORT, (_) => console.log(`listening on PORT ${PORT}`));
