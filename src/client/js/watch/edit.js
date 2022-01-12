const editVideoForm = document.querySelector('.edit-video-form');
const imgThumb = editVideoForm.querySelector('.img-thumbnail');
const inputThumb = editVideoForm.querySelector('.input-thumbnail');

const showThumbnail = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        imgThumb.src = e.target.result;
    };
    reader.readAsDataURL(inputThumb.files[0]);
};

inputThumb.addEventListener('change', showThumbnail);
