const joinForm = document.querySelector('.join-form');
const inputEmail = joinForm.querySelector('.input-email');
const inputPw = joinForm.querySelector('.input-password');
const inputPw2 = joinForm.querySelector('.input-password2');
const inputName = joinForm.querySelector('.input-channel-name');
const inputAvatar = joinForm.querySelector('.input-avatar');
const emailMsg = joinForm.querySelector('.email-msg');
const nameMsg = joinForm.querySelector('.name-msg');
const passwordMsg = joinForm.querySelector('.password-msg');
const password2Msg = joinForm.querySelector('.password-confirm-msg');
const avatar = joinForm.querySelector('.avatar');
const joinBtn = joinForm.querySelector('.join-btn');

const emailCheck = async (event) => {
    // email valid check
    const emailFormat = new RegExp(
        '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,6}$'
    );
    console.log();
    const formatOk = emailFormat.test(inputEmail.value);
    if (!formatOk) {
        emailMsg.innerText =
            inputEmail.value === '' ? 'Required' : 'Email is invalid';
        event.target.classList.add('invalid');
        return;
    }
    // registered email check
    const check = await (
        await fetch('/join/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: inputEmail.value }),
        })
    ).json();
    if (check.email === 'taken') {
        emailMsg.innerText = 'Already taken';
        event.target.classList.add('invalid');
    } else if (check.email === 'valid') {
        emailMsg.innerText = 'Valid Email';
        event.target.classList.remove('invalid');
    }
};

const nameCheck = async (event) => {
    const check = await (
        await fetch('/join/name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: inputName.value }),
        })
    ).json();
    if (check.name === 'taken') {
        nameMsg.innerText = 'Already taken';
        event.target.classList.add('invalid');
    } else {
        nameMsg.innerText =
            inputName.value === '' ? 'Required' : 'Valid Channel name';
        event.target.classList.remove('invalid');
    }
};

const pwCheck = (event) => {
    const passwordFormat = new RegExp(
        '(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}'
    );
    if (!passwordFormat.test(inputPw.value)) {
        passwordMsg.innerText =
            inputPw.value === ''
                ? 'Required'
                : 'more than 8 characters, and one or more [Letters, Numbers, and (!)(@)(#)($)(%)(&)(*)(?)]';
        event.target.classList.add('invalid');
    } else {
        passwordMsg.innerText = 'password ok';
        event.target.classList.remove('invalid');
    }
};

const pwConfirm = (event) => {
    if (inputPw.value !== inputPw2.value) {
        password2Msg.innerText =
            inputPw.value === '' ? 'Required' : 'Password confirmation Error';
        inputPw2.classList.add('invalid');
    } else {
        password2Msg.innerText =
            inputPw.value === '' ? 'Required' : 'password confirmation ok';
        inputPw2.classList.remove('invalid');
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
    const required = joinForm.querySelectorAll('.invalid');
    required.forEach((element) => {
        if (element.classList.contains('invalid') && element.value === '') {
            element.nextSibling.innerText = 'required';
        }
    });
    if (required) {
        required[0].previousSibling.scrollIntoView();
        return;
    }
    return joinForm.submit();
};

inputEmail.addEventListener('input', emailCheck);
inputName.addEventListener('input', nameCheck);
inputPw.addEventListener('input', pwCheck);
inputPw.addEventListener('blur', pwConfirm);
inputPw2.addEventListener('input', pwConfirm);
inputAvatar.addEventListener('change', showAvatar);
joinBtn.addEventListener('click', validCheck);
