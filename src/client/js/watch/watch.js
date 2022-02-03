const watch = document.querySelector('.watch');
const watchVideo = watch.querySelector('video');
const views = watch.querySelector('.views');
const likedBtn = watch.querySelector('.liked-button');
const likedIcon = likedBtn.querySelector('i');
const likedNum = likedBtn.querySelector('strong');
const dislikedBtn = watch.querySelector('.disliked-button');
const dislikedIcon = dislikedBtn.querySelector('i');
const dislikedNum = dislikedBtn.querySelector('strong');
const saveLibraryBtn = watch.querySelector('.save-button');
const librarySavedText = saveLibraryBtn.querySelector('strong');

// controller
const videoPlayer = watch.querySelector('.watch-video-player');
const videoController = watch.querySelector('.watch-video-controller');
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

const url = window.location.pathname;
let volume = 0.5;
let controlsTimeout = null;
let controlsMovementTimeout = null;

const countViews = () => {
    // client view count
    views.innerText = Number(views.innerText) + 1;

    // server view count
    fetch(`${url}/api/views`, {
        method: 'GET',
    });
};

const IconChange = (booleanSaved, buttonType, buttonIcon, buttonNum) => {
    if (booleanSaved) {
        // change Icon filled one
        buttonIcon.className = `ic-${buttonType}d-fill`;
        // count liked/disliked number
        buttonNum.innerText = isNaN(Number(buttonNum.innerText) + 1)
            ? 1
            : Number(buttonNum.innerText) + 1;
    } else {
        // change Icon
        buttonIcon.className = `ic-${buttonType}d`;
        // count liked/disliked number
        buttonNum.innerText =
            Number(buttonNum.innerText) - 1 === 0
                ? `${buttonType}`
                : Number(buttonNum.innerText) - 1;
    }
};

const saveLiked = async () => {
    const liked = await (
        await fetch(`${url}/api/liked`, {
            method: 'GET',
        })
    ).json();

    IconChange(liked.saved, 'like', likedIcon, likedNum);
};

const saveDisliked = async () => {
    const disliked = await (
        await fetch(`${url}/api/disliked`, {
            method: 'GET',
        })
    ).json();

    IconChange(disliked.saved, 'dislike', dislikedIcon, dislikedNum);
};

const saveAtLibrary = async () => {
    const library = await (
        await fetch(`${url}/api/library`, {
            method: 'GET',
        })
    ).json();

    if (library.saved) {
        librarySavedText.innerText = 'Unsave';
    } else {
        librarySavedText.innerText = 'save';
    }
};

//controller

const addClass = (element, addClass, remClass1, remClass2) => {
    element.classList.add(addClass);
    element.classList.remove(remClass1);
    element.classList.remove(remClass2);
};

const playAndPause = () => {
    if (watchVideo.paused) {
        watchVideo.play();
        addClass(playIcon, 'ic-pause', 'ic-play');
    } else {
        watchVideo.pause();
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
    watchVideo.muted = false;
    watchVideo.volume = 0.1;
    volume = 0.1;
    volumeInput.value = 0.1;
    showVolDown();
};

const handleMute = () => {
    // unmute volume 0 >> volume 0.1
    if (watchVideo.volume === 0) {
        unmuteVolumeZero();
        return;
    }
    // control mute
    if (watchVideo.muted) {
        watchVideo.muted = false;
        volumeInput.value = volume;
        volume < 0.5 ? showVolDown() : showVolUp();
    } else {
        watchVideo.muted = true;
        volumeInput.value = 0;
        showMute();
    }
};

const changeVolumeIcon = (value) => {
    volume = value;
    watchVideo.volume = value;
    if (value === 0) {
        watchVideo.muted = true;
        showMute();
    } else if (value < 0.5) {
        watchVideo.muted = false;
        showVolDown();
    } else {
        watchVideo.muted = false;
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
    const videoFullSeconds = watchVideo.duration;
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
    watchVideo.currentTime = Number(value);
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
            handleFullScreen();
            break;

        case 'KeyM':
            handleMute();
            break;

        case 'ArrowRight':
            watchVideo.currentTime =
                watchVideo.currentTime + 5 > watchVideo.duration
                    ? watchVideo.duration
                    : watchVideo.currentTime + 5;
            break;
        case 'ArrowLeft':
            watchVideo.currentTime =
                watchVideo.currentTime - 5 < 0
                    ? (watchVideo.currentTime = 0)
                    : watchVideo.currentTime - 5;
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

if (watchVideo.readyState === 4) {
    handleLoadedMetaData();
}

watchVideo.addEventListener('ended', countViews);
likedBtn.addEventListener('click', saveLiked);
dislikedBtn.addEventListener('click', saveDisliked);
saveLibraryBtn.addEventListener('click', saveAtLibrary);

// controller
playBtn.addEventListener('click', playAndPause);
watchVideo.addEventListener('click', playAndPause);
muteBtn.addEventListener('click', handleMute);
volumeInput.addEventListener('input', handleVolumeChange);
watchVideo.addEventListener('loadedmetadata', handleLoadedMetaData);
watchVideo.addEventListener('timeupdate', handleTimeUpdate);
timeLine.addEventListener('input', handleTimeLine);
fullscreenBtn.addEventListener('click', handleFullscreen);
videoPlayer.addEventListener('fullscreenchange', handleFullscreen);
videoPlayer.addEventListener('mousemove', handleMouseMove);
videoPlayer.addEventListener('mouseleave', handleMouseLeave);
document.addEventListener('keydown', handleKeyboard);
