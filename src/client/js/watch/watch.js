const watch = document.querySelector('.watch');
const watchVideo = watch.querySelector('video');
const views = watch.querySelector('.views');
const likedBtn = watch.querySelector('.liked-button');
const likedIcon = likedBtn.querySelector('i');
const likedNum = likedBtn.querySelector('strong');
const dislikedBtn = watch.querySelector('.disliked-button');
const dislikedIcon = dislikedBtn.querySelector('i');
const dislikedNum = dislikedBtn.querySelector('strong');
const saveLibraryBtn = watch.querySelector('.save-button');
const librarySavedText = saveLibraryBtn.querySelector('strong');
const subscribeBtn = watch.querySelector('.subscribe-button');
const subscribers = watch.querySelector('.subscribers');

const url = window.location.pathname;

const countViews = () => {
    // client view count
    views.innerText = Number(views.innerText) + 1;

    // server view count
    fetch(`${url}/api/views`, {
        method: 'GET',
    });
};

const IconChange = (booleanSaved, buttonType, buttonIcon, buttonNum) => {
    if (booleanSaved) {
        // change Icon filled one
        buttonIcon.className = `ic-${buttonType}d-fill`;
        // count liked/disliked number
        buttonNum.innerText = isNaN(Number(buttonNum.innerText) + 1)
            ? 1
            : Number(buttonNum.innerText) + 1;
    } else {
        // change Icon
        buttonIcon.className = `ic-${buttonType}d`;
        // count liked/disliked number
        buttonNum.innerText =
            Number(buttonNum.innerText) - 1 === 0
                ? `${buttonType}`
                : Number(buttonNum.innerText) - 1;
    }
};

const saveLiked = async () => {
    const liked = await (
        await fetch(`${url}/api/liked`, {
            method: 'GET',
        })
    ).json();

    IconChange(liked.saved, 'like', likedIcon, likedNum);
};

const saveDisliked = async () => {
    const disliked = await (
        await fetch(`${url}/api/disliked`, {
            method: 'GET',
        })
    ).json();

    IconChange(disliked.saved, 'dislike', dislikedIcon, dislikedNum);
};

const saveAtLibrary = async () => {
    const library = await (
        await fetch(`${url}/api/library`, {
            method: 'GET',
        })
    ).json();

    if (library.saved) {
        librarySavedText.innerText = 'Unsave';
    } else {
        librarySavedText.innerText = 'save';
    }
};

const saveSubscribed = async () => {
    const subscription = await (
        await fetch(`${url}/api/subscription`, {
            method: 'GET',
        })
    ).json();

    if (subscription.saved) {
        subscribeBtn.innerText = 'Unsubscribe';
        subscribers.innerText = Number(subscribers.innerText) + 1;
    } else {
        subscribeBtn.innerText = 'subscribe';
        subscribers.innerText = Number(subscribers.innerText) - 1;
    }
};

watchVideo.addEventListener('ended', countViews);
likedBtn.addEventListener('click', saveLiked);
dislikedBtn.addEventListener('click', saveDisliked);
saveLibraryBtn.addEventListener('click', saveAtLibrary);
subscribeBtn.addEventListener('click', saveSubscribed);
