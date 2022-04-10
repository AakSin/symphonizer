let express = require("express");
const res = require("express/lib/response");
let http = require("http");
let io = require("socket.io");
const port = process.env.PORT || 8800;
let app = express();
let server = http.createServer(app); // wrap the express app with http
io = new io.Server(server); // use socket.io on the http app
let Datastore = require("nedb");
app.use("/", express.static("public"));
app.use("/:roomID", express.static("public/artboard"));

//intialise database
let db = new Datastore({
  filename: "rooms.db",
}); //creates a new one if needed
db.loadDatabase(); //loads the db with the data

const maxPlayers = 3;

// sockets --> check for socket connection
io.sockets.on("connection", (socket) => {
  console.log("We have a new client", socket.id);
  // naming this something apart from roomId makes it only work
  let roomCode;

  socket.on("room", (roomId) => {
    let newPlayers;
    db.findOne({ _id: roomId }, function (err, doc) {
      if (err) {
        io.to(socket.id).emit("invalidRoom");
      } else if (doc == null) {
        io.to(socket.id).emit("invalidRoom");
      } else {
        roomCode = doc._id;
        socket.join(doc._id);
        newPlayers = doc.players + 1;
        db.update(
          { _id: roomId },
          { $set: { players: newPlayers } },
          { multi: true },
          function (err, numReplaced) {}
        );
        console.log(doc);
        io.to(socket.id).emit("roomInfo", doc);
        if (newPlayers <= maxPlayers) {
          io.to(socket.id).emit("role", "player");
        } else {
          io.to(socket.id).emit("role", "spectator");
        }
      }
    });
  });
  socket.on("keyPressed", (keyCode) => {
    io.to(roomCode).emit("keyPressed", keyCode);
  });
  socket.on("createRoom", (data) => {
    console.log("hello");

    roomInfo = {};
    roomInfo.visuals = data.visuals;
    roomInfo.audio = data.audio;
    roomInfo.players = 0;
    db.insert(roomInfo, function (err, newDoc) {
      // Callback is optional
      io.to(socket.id).emit("redirect", newDoc._id);
    });
  });
  // drop a message on the server when socket disconnects
  socket.on("disconnect", () => {
    let newPlayers;
    db.findOne({ _id: roomCode }, function (err, doc) {
      if (err) {
        console.log(err);
      } else if (doc == null) {
        console.log("pass");
      } else {
        newPlayers = doc.players - 1;
        db.update(
          { _id: roomCode },
          { $set: { players: newPlayers } },
          { multi: true },
          function (err, numReplaced) {}
        );
        if (newPlayers < 1) {
          db.remove({ _id: roomCode }, {}, function (err, numRemoved) {
            console.log("room removed");
          });
        }
      }
    });

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
