const startRecordingBtn = document.querySelector('.start-recording');
const video = document.querySelector('.recording-video');

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoFile;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
};

const handleStop = () => {
    startRecordingBtn.innerText = 'Download Recording';
    startRecordingBtn.removeEventListener('click', handleStop);
    startRecordingBtn.addEventListener('click', handleDownload);
    recorder.stop();
};

const handleStart = async () => {
    startRecordingBtn.innerText = 'Stop Recording';
    startRecordingBtn.removeEventListener('click', handleStart);
    startRecordingBtn.addEventListener('click', handleStop);
    recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = (event) => {
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    };
    recorder.start();
};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject = stream;
    video.play();
};

init();

startRecordingBtn.addEventListener('click', handleStart);
