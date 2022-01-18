const editChannelForm = document.querySelector('.edit-channel-form');
const editInputName = editChannelForm.querySelector('.input-name');
const editInputAvatar = editChannelForm.querySelector('.input-avatar');
const editNameMsg = editChannelForm.querySelector('.name-msg');
const editAvatar = editChannelForm.querySelector('.avatar');
const editBtn = editChannelForm.querySelector('.edit-btn');

const invalid = (element) => {
    element.classList.add('invalid');
};
const valid = (element) => {
    element.classList.remove('invalid');
};

const nameCheck = async () => {
    const url = window.location.pathname;
    const check = await (
        await fetch(`${url}/name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: editInputName.value }),
        })
    ).json();
    if (check.name === 'taken') {
        editNameMsg.innerText =
            editInputName.value === '' ? '' : 'Channel name is already taken';
        invalid(editInputName);
        invalid(editNameMsg);
    } else {
        // check.name === 'valid'
        valid(editInputName);
        valid(editNameMsg);
        editNameMsg.innerText =
            editInputName.value === '' ? '' : 'Valid Channel name';
    }
};

const showAvatar = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        editAvatar.src = e.target.result;
    };
    reader.readAsDataURL(editInputAvatar.files[0]);
};

const validCheck = (event) => {
    event.preventDefault();
    if (editInputName.classList.contains('invalid')) {
        editNameMsg.innerText =
            editInputName.value === ''
                ? 'required'
                : 'Channel name is already taken';
        const required = editChannelForm.querySelector('.invalid');
        required.previousSibling.scrollIntoView();
    } else {
        editChannelForm.submit();
    }
};

editInputName.addEventListener('input', nameCheck);
editInputAvatar.addEventListener('change', showAvatar);
editBtn.addEventListener('click', validCheck);
