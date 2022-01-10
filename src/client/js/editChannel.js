const editChannelForm = document.querySelector('.edit-channel-form');
const inputName = editChannelForm.querySelector('.input-name');
const inputAvatar = editChannelForm.querySelector('.input-avatar');
const nameMsg = editChannelForm.querySelector('.name-msg');
const avatar = editChannelForm.querySelector('.avatar');
const editBtn = editChannelForm.querySelector('.edit-btn');

const nameCheck = async () => {
    const url = window.location.pathname;
    const check = await (
        await fetch(`${url}/name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: inputName.value }),
        })
    ).json();
    if (check.name === 'taken') {
        nameMsg.innerText =
            inputName.value === '' ? '' : 'Channel name is already taken';
        inputName.classList.add('invalid');
    } else {
        // check.name === 'valid'
        inputName.classList.remove('invalid');
        nameMsg.innerText = inputName.value === '' ? '' : 'Valid Channel name';
    }
};

const showAvatar = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        avatar.src = e.target.result;
    };
    reader.readAsDataURL(inputAvatar.files[0]);
};

const validCheck = (event) => {
    event.preventDefault();
    if (inputName.classList.contains('invalid')) {
        nameMsg.innerText =
            inputName.value === ''
                ? 'required'
                : 'Channel name is already taken';
        const required = editChannelForm.querySelector('.invalid');
        required.previousSibling.scrollIntoView();
    } else {
        editChannelForm.submit();
    }
};

inputName.addEventListener('input', nameCheck);
inputAvatar.addEventListener('change', showAvatar);
editBtn.addEventListener('click', validCheck);
