const headerContainer = document.querySelector('.header-container');
const avatarBtn = headerContainer.querySelector('.avatar-btn');
const menu = headerContainer.querySelector('.avatar-click-menu');

showMenu = (event) => {
    menu.classList.toggle('hidden');
};

hideMenu = (event) => {
    menu.classList.add('hidden');
};

mousedownMenu = (event) => {
    event.preventDefault();
};

avatarBtn.addEventListener('click', showMenu);
avatarBtn.addEventListener('blur', hideMenu);
menu.addEventListener('mousedown', mousedownMenu);
