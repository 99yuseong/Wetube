import { application } from 'express';

const joinForm = document.querySelector('.join-form');
const inputEmail = joinForm.querySelector('.input-email');
const emailMsg = joinForm.querySelector('.email-msg');
const inputPw = joinForm.querySelector('.input-password');
const inputPw2 = joinForm.querySelector('.input-password2');
const inputName = joinForm.querySelector('.input-channel-name');
const inputAvatar = joinForm.querySelector('.input-avatar');
const joinBtn = joinForm.querySelector('.join-btn');

const emailCheck = async (event) => {
    // email valid check
    const emailFormat = new RegExp(
        '^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,6}$'
    );
    const formatOk = emailFormat.test(inputEmail.value);
    if (!formatOk) {
        emailMsg.innerText = inputEmail.value === '' ? '' : 'Email is invalid';
        joinBtn.setAttribute('disabled', false);
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
    if (check.email === 'valid') {
        emailMsg.innerText = 'Valid Email';
        joinBtn.setAttribute('disabled', true);
    } else if (check.email === 'taken') {
        emailMsg.innerText = 'Already taken';
        joinBtn.setAttribute('disabled', false);
    }
};

const nameCheck = (event) => {
    const check = await fetch('/join/name', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inputName.value }),
    });
    console.log('name-check!');
};

inputEmail.addEventListener('input', emailCheck);
inputName.addEventListener('input', nameCheck);
