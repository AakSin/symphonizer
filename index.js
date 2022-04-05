let express = require("express");
let http = require("http");
let io = require("socket.io");

let app = express();
let server = http.createServer(app); // wrap the express app with http
io = new io.Server(server); // use socket.io on the http app

app.use("/", express.static("public"));
app.use("/:roomID", express.static("public/artboard"));

const maxPlayers = 2;
roomTracker = {};
// sockets --> check for socket connection
io.sockets.on("connection", (socket) => {
  console.log("We have a new client", socket.id);
  // naming this something apart from roomId makes it only work
  let roomNumber;

  socket.on("room", (roomId) => {
    roomNumber = roomId;
    socket.join(roomId);
    if (roomTracker[roomId]) {
      roomTracker[roomId].number += 1;
      if (roomTracker[roomId].number <= maxPlayers) {
        io.to(socket.id).emit("role", "player");
      } else {
        io.to(socket.id).emit("role", "spectator");
      }
    } else {
      roomTracker[roomId] = {};
      roomTracker[roomId].number = 1;
      io.to(socket.id).emit("role", "player");
    }

    console.log(roomTracker);
  });
  socket.on("keyPressed", (keyCode) => {
    io.to(roomNumber).emit("keyPressed", keyCode);
  });
  // drop a message on the server when socket disconnects
  socket.on("disconnect", () => {
    roomTracker[roomNumber].number -= 1;
    console.log("socket has been disconnected", socket.id);
  });
});
// server listening on port
server.listen(8800, () => {
  console.log("server is up and running");
});

// Client has to send the message to the server --> EMIT
// Server has to receive and process this information --> ON
// Server emits information to ALL clients
// Client does soemthing when it gets information back --> ON