let trainLeftPos = 0;
let trainOrientation = "right";
let speed = 0.05;
let trainTimer = 60;
let trainState = "FULLSPEED";

function update() {
    let windowWidth = window.innerWidth;
    let middleScreen = windowWidth/2;

    let trainWidth = document.getElementById("train").offsetWidth;
    let trainMedian = trainLeftPos+(trainWidth/2);

    let stationWidth = document.getElementById("station").offsetWidth;
    let leftStationBound = middleScreen-stationWidth;
    let rightStationBound = middleScreen+stationWidth;

    let fullSpeed = 5;

    trainOrientation = setTrainOrientation(trainOrientation, trainWidth, windowWidth);

    // cap max speed to FULLSPEED
    if (trainState !== "FREINAGE" && speed >= fullSpeed) {
        trainState = "FULLSPEED"
    }

    // le train entre en gare par la gauche
    if (trainMedian > leftStationBound && trainMedian < middleScreen && trainOrientation === "right") {
        trainState = "FREINAGE";
        trainTimer = 60;
    }

    // le train entre en gare par la droite
    if (trainMedian < rightStationBound && trainMedian > middleScreen && trainOrientation === "left") {
        trainState = "FREINAGE";
        trainTimer = 60;
    }

    if (speed <= 0.01 && trainTimer > 0) {
        trainState = "STOP";
    }

    if (trainTimer === 0 && trainState === "STOP") {
        trainState = "ACCELERATION";
    }

    switch(trainState) {
        case "FULLSPEED":
            speed = fullSpeed;
            break;
        case "STOP":
            speed = 0;
            trainTimer = trainTimer-1;
            break;
        case "FREINAGE":
            speed = speed-0.05;
            break;
        case "ACCELERATION":
            speed = speed+0.05;
            break;
        default:
            speed = fullSpeed;
            break;
    }

    // final move
    if (trainOrientation === "left") trainLeftPos = trainLeftPos-speed;
    if (trainOrientation === "right") trainLeftPos = trainLeftPos+speed;

    document.getElementById("train").style.left = trainLeftPos+"px";
}

function setTrainOrientation(initialTrainOrientation, trainWidth, windowWidth) {
    if (trainLeftPos+trainWidth >= windowWidth+(trainWidth)) {
        document.getElementById("train").style.transform = "scaleX(-1)";
        return "left";
    }
    if (trainLeftPos <= -(trainWidth)) {
        document.getElementById("train").style.transform = "scaleX(1)";
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
window.requestAnimationFrame(loop);