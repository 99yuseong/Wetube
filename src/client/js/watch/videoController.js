const videoPlayer = document.querySelector('.video-player');
const video = videoPlayer.querySelector('video');
const videoController = videoPlayer.querySelector('.video-controller');
const playBtn = videoController.querySelector('.play');
const playIcon = playBtn.querySelector('i');
const muteBtn = videoController.querySelector('.mute');
const muteIcon = muteBtn.querySelector('i');
const volumeInput = videoController.querySelector('.volume');
const time = videoController.querySelector('.time');
const timeLine = videoController.querySelector('.time-line');
const currentTime = time.querySelector('.current-time');
const duration = time.querySelector('.duration');
const fullscreen = videoController.querySelector('.fullscreen');
const fullscreenBtn = fullscreen.querySelector('i');
const inputArray = document.querySelectorAll('input');

let volume = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const addClass = (element, addClass, remClass1, remClass2) => {
    element.classList.add(addClass);
    element.classList.remove(remClass1);
    element.classList.remove(remClass2);
};

const playAndPause = () => {
    if (video.paused) {
        video.play();
        addClass(playIcon, 'ic-pause', 'ic-play');
    } else {
        video.pause();
        addClass(playIcon, 'ic-play', 'ic-pause');
    }
};

const showMute = () => {
    addClass(muteIcon, 'ic-mute', 'ic-low-volume', 'ic-high-volume');
};

const showVolUp = () => {
    addClass(muteIcon, 'ic-high-volume', 'ic-low-volume', 'ic-mute');
};

const showVolDown = () => {
    addClass(muteIcon, 'ic-low-volume', 'ic-high-volume', 'ic-mute');
};

const unmuteVolumeZero = () => {
    video.muted = false;
    video.volume = 0.1;
    volume = 0.1;
    volumeInput.value = 0.1;
    showVolDown();
};

const handleMute = () => {
    // unmute volume 0 >> volume 0.1
    if (video.volume === 0) {
        unmuteVolumeZero();
        return;
    }
    // control mute
    if (video.muted) {
        video.muted = false;
        volumeInput.value = volume;
        volume < 0.5 ? showVolDown() : showVolUp();
    } else {
        video.muted = true;
        volumeInput.value = 0;
        showMute();
    }
};

const changeVolumeIcon = (value) => {
    volume = value;
    video.volume = value;
    if (value === 0) {
        video.muted = true;
        showMute();
    } else if (value < 0.5) {
        video.muted = false;
        showVolDown();
    } else {
        video.muted = false;
        showVolUp();
    }
};

const handleVolumeChange = (event) => {
    const value = Number(event.target.value);
    changeVolumeIcon(value);
};

const formatTime = (seconds) => {
    const time = new Date(seconds * 1000).toISOString().substring(11, 19);
    return time.startsWith('00:') ? time.slice(3) : time;
};

const handleLoadedMetaData = () => {
    const videoFullSeconds = video.duration;
    duration.innerText = formatTime(Math.floor(videoFullSeconds));
    timeLine.max = videoFullSeconds;
};

const handleTimeUpdate = (event) => {
    const currentSeconds = event.target.currentTime;
    currentTime.innerText = formatTime(Math.floor(currentSeconds));
    timeLine.value = currentSeconds;
};

const handleTimeLine = (event) => {
    const {
        target: { value },
    } = event;
    video.currentTime = Number(value);
    currentTime.innerText = formatTime(Math.floor(value));
};

const handleFullscreen = () => {
    const fullScreen = document.fullscreenElement;
    if (fullScreen) {
        document.exitFullscreen();
        addClass(fullscreenBtn, 'ic-fullscreen', 'ic-fullscreen-exit');
    } else {
        videoPlayer.requestFullscreen();
        addClass(fullscreenBtn, 'ic-fullscreen-exit', 'ic-fullscreen');
    }
};

const hideControls = () => {
    videoController.classList.remove('showing');
};

const handleMouseMove = () => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoController.classList.add('showing');
    controlsMovementTimeout = setTimeout(hideControls, 1000);
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(() => hideControls, 1000);
};

const handleKeyboard = (event) => {
    handleMouseMove();
    switch (event.code) {
        case 'Space':
            playAndPause();
            break;

        case 'KeyF':
            handleFullscreen();
            break;

        case 'KeyM':
            handleMute();
            break;

        case 'ArrowRight':
            video.currentTime =
                video.currentTime + 5 > video.duration
                    ? video.duration
                    : video.currentTime + 5;
            break;
        case 'ArrowLeft':
            video.currentTime =
                video.currentTime - 5 < 0
                    ? (video.currentTime = 0)
                    : video.currentTime - 5;
            break;
        case 'ArrowUp':
            volumeInput.value = String(Number(volumeInput.value) + 0.05);
            changeVolumeIcon(Number(volumeInput.value));
            break;
        case 'ArrowDown':
            volumeInput.value = String(Number(volumeInput.value) - 0.05);
            changeVolumeIcon(Number(volumeInput.value));
            break;
    }
};

const focusInput = () => {
    document.removeEventListener('keydown', handleKeyboard);
};
const blurInput = () => {
    document.addEventListener('keydown', handleKeyboard);
};

if (video.readyState === 4) {
    handleLoadedMetaData();
}

playBtn.addEventListener('click', playAndPause);
video.addEventListener('click', playAndPause);
muteBtn.addEventListener('click', handleMute);
volumeInput.addEventListener('input', handleVolumeChange);
video.addEventListener('loadedmetadata', handleLoadedMetaData);
video.addEventListener('timeupdate', handleTimeUpdate);
timeLine.addEventListener('input', handleTimeLine);
fullscreenBtn.addEventListener('click', handleFullscreen);
videoPlayer.addEventListener('mousemove', handleMouseMove);
videoPlayer.addEventListener('mouseleave', handleMouseLeave);
document.addEventListener('keydown', handleKeyboard);
inputArray.forEach((input) => input.addEventListener('focus', focusInput));
inputArray.forEach((input) => input.addEventListener('blur', blurInput));
