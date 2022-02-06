const commentForm = document.getElementById('comment-form');
const input = commentForm.querySelector('.comment-input');
const addCommentBtn = commentForm.querySelector('.comment-btn');
const cancelBtn = commentForm.querySelector('.cancel-btn');
const delCommentBtnArray = document.querySelectorAll('.del-comment');
const commentList = document.querySelector('.comment-list');
const commentCount = document.querySelector('.count');
const commentUnit = document.querySelector('.count-unit');

const url = window.location.pathname;
let count = Number(commentCount.innerText);

const showCommentAndCancelBtn = () => {
    addCommentBtn.classList.remove('hide');
    addCommentBtn.removeAttribute('disabled');
    cancelBtn.classList.remove('hide');
    cancelBtn.removeAttribute('disabled');
};

const hideCommentAndCancelBtn = (event) => {
    if (event.target === cancelBtn || input.value === '') {
        input.value = '';
        addCommentBtn.classList.add('hide');
        addCommentBtn.setAttribute('disabled', '');
        cancelBtn.classList.add('hide');
        cancelBtn.setAttribute('disabled', '');
    }
};

const deleteComment = (event) => {
    const deletingComment = event.target.parentNode;
    deletingComment.remove();
    commentCount.innerText = count - 1;
    count = count - 1;
    commentUnit.innerText = count > 1 ? 'Comments' : 'Comment';
    fetch(`${url}/api/delComment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletingComment: deletingComment.id }),
    });
};

const handleCommentBtn = () => {
    if (input.value === '') {
        addCommentBtn.classList.add('disabled');
        addCommentBtn.setAttribute('disabled', '');
        return;
    }
    addCommentBtn.removeAttribute('disabled');
    addCommentBtn.classList.remove('disabled');
};

const showComment = (commentObj) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    const avatar = document.createElement('img');
    const div = document.createElement('div');
    const span = document.createElement('span');
    const strong = document.createElement('strong');
    const small = document.createElement('small');
    const p = document.createElement('p');
    const button = document.createElement('button');
    li.setAttribute('id', commentObj._id);
    a.setAttribute('href', `/channel/${commentObj.channel}`);
    avatar.setAttribute('src', commentObj.avatarUrl);
    avatar.setAttribute('alt', `${commentObj.name}의 avatar image`);
    avatar.classList.add('avatar-img');
    strong.innerText = commentObj.name;
    small.innerText = `${
        [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ][new Date().getMonth() + 1]
    }. ${new Date().getDate()}. ${new Date().getFullYear()}`;
    p.innerText = commentObj.comment;
    button.innerText = '❌';
    button.addEventListener('click', deleteComment);
    a.appendChild(avatar);
    span.appendChild(strong);
    span.appendChild(small);
    div.appendChild(span);
    div.appendChild(p);
    li.appendChild(a);
    li.appendChild(div);
    li.appendChild(button);
    commentList.prepend(li);
};

const handleComment = async (event) => {
    event.preventDefault();
    const comment = input.value;
    input.value = '';
    handleCommentBtn();
    input.focus();
    const { newComment } = await (
        await fetch(`${url}/api/addComment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment }),
        })
    ).json();
    showComment(newComment);
    commentCount.innerText = count + 1;
    count = count + 1;
    commentUnit.innerText = count > 1 ? 'Comments' : 'Comment';
};

addCommentBtn.addEventListener('click', handleComment);
input.addEventListener('input', handleCommentBtn);
input.addEventListener('focus', showCommentAndCancelBtn);
input.addEventListener('blur', hideCommentAndCancelBtn);
cancelBtn.addEventListener('click', hideCommentAndCancelBtn);
if (delCommentBtnArray) {
    delCommentBtnArray.forEach((element) => {
        element.addEventListener('click', deleteComment);
    });
}
