// join
const joinForm = document.querySelector('.join-form');
const joinInputEmail = joinForm.querySelector('.input-email');
const joinInputPw = joinForm.querySelector('.input-password');
const joinInputPw2 = joinForm.querySelector('.input-password2');
const joinInputName = joinForm.querySelector('.input-channel-name');
const joinInputAvatar = joinForm.querySelector('.input-avatar');
const joinEmailMsg = joinForm.querySelector('.email-msg');
const joinNameMsg = joinForm.querySelector('.name-msg');
const joinPasswordMsg = joinForm.querySelector('.password-msg');
const joinPassword2Msg = joinForm.querySelector('.password-confirm-msg');
const joinAvatar = joinForm.querySelector('.avatar');
const joinBtn = joinForm.querySelector('.join-btn');

// join handers
const joinEmailCheck = async (event) => {
    // email valid check
    const emailFormat = new RegExp(
        '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,6}$'
    );
    const formatOk = emailFormat.test(joinInputEmail.value);
    if (!formatOk) {
        joinEmailMsg.innerText =
            joinInputEmail.value === '' ? 'Required' : 'Email is invalid';
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
            body: JSON.stringify({ email: joinInputEmail.value }),
        })
    ).json();
    if (check.email === 'taken') {
        joinEmailMsg.innerText = 'Already taken';
        event.target.classList.add('invalid');
    } else if (check.email === 'valid') {
        joinEmailMsg.innerText = 'Valid Email';
        event.target.classList.remove('invalid');
    }
};

const joinNameCheck = async (event) => {
    const check = await (
        await fetch('/join/name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: joinInputName.value }),
        })
    ).json();
    if (check.name === 'taken') {
        joinNameMsg.innerText = 'Already taken';
        event.target.classList.add('invalid');
    } else {
        joinNameMsg.innerText =
            joinInputName.value === '' ? 'Required' : 'Valid Channel name';
        event.target.classList.remove('invalid');
    }
};

const joinPwCheck = (event) => {
    const passwordFormat = new RegExp(
        '(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}'
    );
    if (!passwordFormat.test(joinInputPw.value)) {
        joinPasswordMsg.innerText =
            joinInputPw.value === ''
                ? 'Required'
                : 'more than 8 characters, and one or more [Letters, Numbers, and (!)(@)(#)($)(%)(&)(*)(?)]';
        event.target.classList.add('invalid');
    } else {
        joinPasswordMsg.innerText = 'password ok';
        event.target.classList.remove('invalid');
    }
};

const joinPwConfirm = (event) => {
    if (joinInputPw.value !== joinInputPw2.value) {
        joinPassword2Msg.innerText =
            joinInputPw.value === ''
                ? 'Required'
                : 'Password confirmation Error';
        joinInputPw2.classList.add('invalid');
    } else {
        joinPassword2Msg.innerText =
            joinInputPw.value === '' ? 'Required' : 'password confirmation ok';
        joinInputPw2.classList.remove('invalid');
    }
};

const joinShowAvatar = () => {
    const reader = new FileReader();
    reader.onload = (e) => {
        joinAvatar.src = e.target.result;
    };
    reader.readAsDataURL(joinInputAvatar.files[0]);
};

const joinValidCheck = (event) => {
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

// join event listener
joinInputEmail.addEventListener('input', joinEmailCheck);
joinInputName.addEventListener('input', joinNameCheck);
joinInputPw.addEventListener('input', joinPwCheck);
joinInputPw.addEventListener('blur', joinPwConfirm);
joinInputPw2.addEventListener('input', joinPwConfirm);
joinInputAvatar.addEventListener('change', joinShowAvatar);
joinBtn.addEventListener('click', joinValidCheck);
