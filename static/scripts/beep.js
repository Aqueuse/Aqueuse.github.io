/* audio BEEP */

let dontSpam = false;
let pitch = 1.0;
const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/24/audio_cf65a6004c.mp3');
document.querySelectorAll('b').forEach(function (button) {
  button.addEventListener('click', function (e) {
    e.preventDefault();
    const isPlay = audio.duration > 0 && !audio.paused;
    if (dontSpam === false && !isPlay) {
      dontSpam = true;
      pitch = Math.random()+0.1;
      audio.mozPreservesPitch = false;
      audio.playbackRate = pitch;
      audio.play();
      audio.addEventListener('ended', function () {
        dontSpam = false;
      }, false);
    }
  });
});

/* audio end */