const changePasswordForm = document.querySelector('.change-password-form');
const oldPwInput = changePasswordForm.querySelector('.old-password-input');
const newPwInput = changePasswordForm.querySelector('.new-password-input');
const newPw2Input = changePasswordForm.querySelector('.new-password2-input');
const oldPwMsg = changePasswordForm.querySelector('.old-password-msg');
const newPwMsg = changePasswordForm.querySelector('.new-password-msg');
const newPw2Msg = changePasswordForm.querySelector('.new-password2-msg');

const invalid = (element) => {
    element.classList.add('invalid');
};
const valid = (element) => {
    element.classList.remove('invalid');
};

const oldPwCheck = async () => {
    const { match } = await (
        await fetch(`${window.location.pathname}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: oldPwInput.value }),
        })
    ).json();

    if (!match) {
        oldPwMsg.innerText = 'Incorrect Password';
        invalid(oldPwInput);
        invalid(oldPwMsg);
    } else {
        oldPwMsg.innerText = 'Correct Password';
        valid(oldPwInput);
        valid(oldPwMsg);
    }
};

const newPwCheck = (event) => {
    const passwordFormat = new RegExp(
        '(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}'
    );

    if (
        oldPwInput.value === newPwInput.value &&
        !oldPwInput.classList.contains('invalid')
    ) {
        newPwMsg.innerText = 'New password needed';
        invalid(event.target);
        invalid(newPwMsg);
        return;
    }

    if (!passwordFormat.test(newPwInput.value)) {
        newPwMsg.innerText =
            newPwInput.value === ''
                ? 'Required'
                : 'more than 8 characters, and one or more [Letters, Numbers, and (!)(@)(#)($)(%)(&)(*)(?)]';

        invalid(event.target);
        invalid(newPwMsg);
    } else {
        newPwMsg.innerText = 'Password Valid';
        valid(event.target);
        valid(newPwMsg);
    }
};

const newPwConfirm = () => {
    if (newPwInput.value !== newPw2Input.value) {
        newPw2Msg.innerText =
            newPwInput.value === ''
                ? 'Required'
                : 'Password confirmation Error';
        invalid(newPw2Input);
        invalid(newPw2Msg);
    } else {
        newPw2Msg.innerText =
            newPwInput.value === ''
                ? 'Required'
                : 'Password Confirmation Valid';
        valid(newPw2Input);
        valid(newPw2Msg);
    }
};

oldPwInput.addEventListener('input', oldPwCheck);
newPwInput.addEventListener('input', newPwCheck);
newPwInput.addEventListener('blur', newPwConfirm);
newPw2Input.addEventListener('input', newPwConfirm);
