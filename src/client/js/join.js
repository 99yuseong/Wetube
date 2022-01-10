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

const validObj = {
    email: { valid: 'invalid', msg: emailMsg },
    name: { valid: 'invalid', msg: nameMsg },
    password: { valid: 'invalid', msg: passwordMsg },
    password2: { valid: 'invalid', msg: password2Msg },
};

const emailCheck = async (event) => {
    // email valid check
    const emailFormat = new RegExp(
        '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,6}$'
    );
    const formatOk = emailFormat.test(inputEmail.value);
    if (!formatOk) {
        emailMsg.innerText = inputEmail.value === '' ? '' : 'Email is invalid';
        validObj.email.valid = 'invalid';
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
        validObj.email.valid = 'invalid';
    } else if (check.email === 'valid') {
        emailMsg.innerText = 'Valid Email';
        validObj.email.valid = 'valid';
    }
};

const nameCheck = async () => {
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
        validObj.name.valid = 'invalid';
    } else {
        nameMsg.innerText = inputName.value === '' ? '' : 'Valid Channel name';
        validObj.name.valid = 'valid';
    }
};

const pwCheck = () => {
    const passwordFormat = new RegExp(
        '(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}'
    );
    if (!passwordFormat.test(inputPw.value)) {
        passwordMsg.innerText =
            inputPw.value === ''
                ? 'Required'
                : 'more than 8 characters, and one or more [Letters, Numbers, and (!)(@)(#)($)(%)(&)(*)(?)]';
        validObj.password.valid = 'invalid';
    } else {
        passwordMsg.innerText = 'password ok';
        validObj.password.valid = 'valid';
    }
};

const pwConfirm = () => {
    if (inputPw.value !== inputPw2.value) {
        password2Msg.innerText =
            inputPw.value === '' ? '' : 'Password confirmation Error';
        validObj.password2.valid = 'invalid';
    } else {
        password2Msg.innerText =
            inputPw.value === '' ? '' : 'password confirmation ok';
        validObj.password2.valid = 'valid';
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
    let count = 4;
    for (section in validObj) {
        if (validObj[section].valid === 'invalid') {
            validObj[section].msg.innerText = 'required';
        } else {
            count -= 1;
        }
    }
    if (count === 0) {
        joinForm.submit();
    }
};

inputEmail.addEventListener('input', emailCheck);
inputName.addEventListener('input', nameCheck);
inputPw.addEventListener('input', pwCheck);
inputPw.addEventListener('blur', pwConfirm);
inputPw2.addEventListener('input', pwConfirm);
inputAvatar.addEventListener('change', showAvatar);
joinBtn.addEventListener('click', validCheck);
