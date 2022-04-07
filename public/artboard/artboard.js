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
  audio = data.audio;
  visuals = data.visuals;
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
sounds = [];

function preload() {
  console.log(audio, visuals);
  for (let i = 0; i < 5; i++) {
    sounds[i] = loadSound(`assets/sound/normal/${i}.wav`);
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
      console.log(visuals);
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

  if (audio == "base") {
    switch (data) {
      case 65:
        sounds[0].play();
        break;
      case 66:
        sounds[1].play();
        break;
      case 67:
        sounds[2].play();
        break;
      case 68:
        sounds[3].play();
        break;
      case 69:
        sounds[4].play();
        break;
      case 70:
        effects.push(new fourPararellLines());
        break;
      case 71:
        effects.push(new dynamicBackgroundChange());
        break;
      case 72:
        effects.push(new smoothTransition());
        break;
    }
  }
});
function keyPressed() {
  if (clientRole == "player") {
    socket.emit("keyPressed", keyCode);
  }
}
