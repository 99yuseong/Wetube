// join
const joinSection = document.querySelector('.join-section');
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

const invalid = (element) => {
    element.classList.add('invalid');
};
const valid = (element) => {
    element.classList.remove('invalid');
};

const joinEmailCheck = async (event) => {
    // email valid check
    const emailFormat = new RegExp(
        '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,6}$'
    );
    const formatOk = emailFormat.test(joinInputEmail.value);
    if (!formatOk) {
        joinEmailMsg.innerText =
            joinInputEmail.value === '' ? 'Required' : 'Email is invalid';
        invalid(event.target);
        invalid(joinEmailMsg);
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
        invalid(event.target);
        invalid(joinEmailMsg);
    } else if (check.email === 'valid') {
        joinEmailMsg.innerText = 'Email Valid';
        valid(event.target);
        valid(joinEmailMsg);
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
        invalid(event.target);
        invalid(joinNameMsg);
    } else {
        joinNameMsg.innerText =
            joinInputName.value === '' ? 'Required' : 'Channel name Valid';
        valid(event.target);
        valid(joinNameMsg);
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

        invalid(event.target);
        invalid(joinPasswordMsg);
    } else {
        joinPasswordMsg.innerText = 'Password Valid';
        valid(event.target);
        valid(joinPasswordMsg);
    }
};

const joinPwConfirm = (event) => {
    if (joinInputPw.value !== joinInputPw2.value) {
        joinPassword2Msg.innerText =
            joinInputPw.value === ''
                ? 'Required'
                : 'Password confirmation Error';
        invalid(joinInputPw2);
        invalid(joinPassword2Msg);
    } else {
        joinPassword2Msg.innerText =
            joinInputPw.value === ''
                ? 'Required'
                : 'Password Confirmation Valid';
        valid(joinInputPw2);
        valid(joinPassword2Msg);
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
    if (required.length !== 0) {
        joinSection.scrollIntoView();
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
