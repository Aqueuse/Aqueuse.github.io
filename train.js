let trainLeftPos = 4000;
let trainOrientation = "right";
let speed = 16;
let trainTimer = 60;
let trainState = "FULLSPEED";

let isFirefoxBrowser = navigator.userAgent.indexOf("Firefox") > -1;

function update() {
  let windowWidth = window.innerWidth * 8;
  let middleScreen = windowWidth / 2;

  let trainWidth = document.getElementById("train").offsetWidth;
  let trainMedian = trainLeftPos - trainWidth / 2;

  let stationWidth = document.getElementById("station").offsetWidth / 8;
  let leftStationBound = middleScreen - stationWidth * 2;
  let rightStationBound = middleScreen + stationWidth * 2;

  trainOrientation = setTrainOrientation(
    trainOrientation,
    trainWidth,
    windowWidth
  );

  // cap max speed to FULLSPEED
  if (trainState != "FREINAGE" && speed >= 16) {
    trainState = "FULLSPEED";
  }

  // le train entre en gare par la gauche
  if (
    trainMedian > leftStationBound &&
    trainMedian < middleScreen &&
    trainOrientation == "right"
  ) {
    trainState = "FREINAGE";
    trainTimer = 60;
  }

  // le train entre en gare par la droite
  if (
    trainMedian < rightStationBound &&
    trainMedian > middleScreen &&
    trainOrientation == "left"
  ) {
    trainState = "FREINAGE";
    trainTimer = 60;
  }

  if (speed <= 0.1 && trainTimer > 0) {
    trainState = "STOP";
  }

  if (trainTimer == 0 && trainState == "STOP") {
    trainState = "ACCELERATION";
  }

  switch (trainState) {
    case "FULLSPEED":
      speed = 16;
      break;
    case "STOP":
      speed = 0;
      trainTimer = trainTimer - 1;
      break;
    case "FREINAGE":
      speed = speed - 0.2;
      break;
    case "ACCELERATION":
      speed = speed + 0.2;
      break;
    default:
      speed = 16;
      break;
  }

  // final move
  if (trainOrientation == "left") trainLeftPos = trainLeftPos - speed;
  if (trainOrientation == "right") trainLeftPos = trainLeftPos + speed;

  document.getElementById("train").style.left = trainLeftPos + "px";
}

function setTrainOrientation(initialTrainOrientation, trainWidth, windowWidth) {
  if (trainLeftPos + trainWidth >= windowWidth + trainWidth * 3) {
    //document.getElementById("train").style.transform = "scaleX(-1)";
    //if (document.getElementById("train").classList.contains("train--right")) {
    document.getElementById("train").classList.add("train--right");
    //}
    return "left";
  }
  if (trainLeftPos <= -(trainWidth * 1.5)) {
    document.getElementById("train").classList.remove("train--right");
    //document.getElementById("train").style.transform = "scaleX(1)";
    return "right";
  }
  return initialTrainOrientation;
}

function loop(timestamp) {
  update(timestamp - lastRender);

  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}

var lastRender = 0;
/*if (isFirefoxBrowser) {
    document.getElementsByClassName("ascii-train-animation")[0].style.display = "none";
}*/
window.requestAnimationFrame(loop);
