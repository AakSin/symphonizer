let socket = io(); // opens and connect to socket

//listen for confirmation
socket.on("connect", () => {
  roomId = window.location.pathname;
  roomId = roomId.substring(1, roomId.length - 1);
  socket.emit("room", roomId);
});
let visuals = "forest";
let audio = "base";
socket.on("roomInfo", (data) => {
  console.log(data);
  visuals = data.visuals;
  audio = data.audio;
});
socket.on("invalidRoom", () => {
  document.getElementsByTagName("body")[0].innerHTML =
    "You have entered an invalid room";
});
let clientRole;
socket.on("role", (role) => {
  console.log(role);
  clientRole = role;
});
edmSounds = [];
lofiSounds = [];

function preload() {
  console.log(audio, visuals);
  for (let i = 0; i < 6; i++) {
    edmSounds[i] = loadSound(`assets/sound/edm/${i}.wav`);
  }
  for (let i = 0; i < 6; i++) {
    lofiSounds[i] = loadSound(`assets/sound/lofi/${i}.wav`);
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

let effects = [];
function draw() {
  background(0, 0, 0);
  if (visuals == "fire") {
    background(3, 7, 30);
  }
  if (visuals == "forest") {
    background(216, 243, 220);
  }
  for (let i = effects.length - 1; i >= 0; i--) {
    effects[i].play();
    // if (!effects[i].state) {
    //   effects.splice(i, 1);
    // }
  }
}
socket.on("keyPressed", (data) => {
  switch (data) {
    case 65:
      effects.push(new expandingCirle(visuals));
      break;
    case 66:
      effects.push(new fourCircle(visuals));
      break;
    case 67:
      effects.push(new expandingPolygon(3, visuals));
      break;
    case 68:
      effects.push(new expandingPolygon(4, visuals));
      break;
    case 69:
      effects.push(new expandingPolygon(5, visuals));
      break;
    case 70:
      effects.push(new fourPararellLines());
      break;
    case 71:
      effects.push(new dynamicBackgroundChange());
      break;
    case 72:
      effects.push(new smoothTransition(visuals));
      break;
  }
  if (audio == "edm") {
    switch (data) {
      case 65:
        edmSounds[0].play();
        break;
      case 66:
        edmSounds[1].play();
        break;
      case 67:
        edmSounds[2].play();
        break;
      case 68:
        edmSounds[3].play();
        break;
      case 69:
        edmSounds[4].play();
        break;
      case 70:
        edmSounds[5].play();
        break;
    }
  }
  if (audio == "lofi") {
    switch (data) {
      case 65:
        lofiSounds[0].play();
        break;
      case 66:
        lofiSounds[1].play();
        break;
      case 67:
        lofiSounds[2].play();
        break;
      case 68:
        lofiSounds[3].play();
        break;
      case 69:
        lofiSounds[4].play();
        break;
      case 70:
        lofiSounds[4].play();
        break;
    }
  }
});

function keyPressed() {
  if (clientRole == "player") {
    socket.emit("keyPressed", keyCode);
  }
}
