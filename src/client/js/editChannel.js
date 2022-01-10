const editChannelForm = document.querySelector('.edit-channel-form');
const inputName = editChannelForm.querySelector('.input-name');
const inputAvatar = editChannelForm.querySelector('.input-avatar');
const nameMsg = editChannelForm.querySelector('.name-msg');
const avatar = editChannelForm.querySelector('.avatar');

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
    } else {
        // check.name === 'valid'
        // valid 아닐때 버튼 누르면 required
    }
};

const showAvatar = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        avatar.src = e.target.result;
    };
    reader.readAsDataURL(inputAvatar.files[0]);
};

inputName.addEventListener('input', nameCheck);
inputAvatar.addEventListener('change', showAvatar);
