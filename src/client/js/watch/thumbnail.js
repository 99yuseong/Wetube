const form = document.querySelector('.form');
const imgThumb = form.querySelector('.img-thumbnail');
const inputThumb = form.querySelector('.input-thumbnail');
const video = form.querySelector('.video');
const inputVideo = form.querySelector('.input-video');

const showThumbnail = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        imgThumb.src = e.target.result;
    };
    reader.readAsDataURL(inputThumb.files[0]);
};

const showVideo = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        video.src = e.target.result;
    };
    reader.readAsDataURL(inputVideo.files[0]);
};

if (inputThumb) {
    inputThumb.addEventListener('change', showThumbnail);
}
if (inputVideo) {
    inputVideo.addEventListener('change', showVideo);
}
