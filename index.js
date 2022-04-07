let express = require("express");
const res = require("express/lib/response");
let http = require("http");
let io = require("socket.io");
const port = process.env.PORT || 8800;
let app = express();
let server = http.createServer(app); // wrap the express app with http
io = new io.Server(server); // use socket.io on the http app

app.use("/", express.static("public"));
app.use("/:roomID", express.static("public/artboard"));

const maxPlayers = 10;
let roomCount = 1;
let roomTracker = {
  0: {
    number: 0,
    visuals: "fire",
    audio: "base",
  },
};
// sockets --> check for socket connection
io.sockets.on("connection", (socket) => {
  console.log("We have a new client", socket.id);
  // naming this something apart from roomId makes it only work
  let roomNumber;

  socket.on("room", (roomId) => {
    console.log(roomTracker[roomId]);
    if (roomTracker[roomId]) {
      roomNumber = roomId;
      socket.join(roomId);
      roomTracker[roomId].number += 1;
      io.to(socket.id).emit("roomInfo", roomTracker[roomId]);
      if (roomTracker[roomId].number <= maxPlayers) {
        io.to(socket.id).emit("role", "player");
      } else {
        io.to(socket.id).emit("role", "spectator");
      }
    } else {
      io.to(socket.id).emit("invalidRoom");
    }

    console.log(roomTracker);
  });
  socket.on("keyPressed", (keyCode) => {
    io.to(roomNumber).emit("keyPressed", keyCode);
  });
  socket.on("createRoom", (data) => {
    roomTracker[roomCount] = {};
    roomTracker[roomCount].visuals = data.visuals;
    roomTracker[roomCount].audio = data.audio;
    roomTracker[roomCount].number = 0;
    io.to(socket.id).emit("redirect", roomCount);
    roomCount++;
  });
  // drop a message on the server when socket disconnects
  socket.on("disconnect", () => {
    if (roomTracker[roomNumber]) {
      roomTracker[roomNumber].number -= 1;
    }
    console.log("socket has been disconnected", socket.id);
  });
});
// server listening on port
server.listen(port, () => {
  console.log("server is up and running");
});

// Client has to send the message to the server --> EMIT
// Server has to receive and process this information --> ON
// Server emits information to ALL clients
// Client does soemthing when it gets information back --> ON
