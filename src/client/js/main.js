import '../scss/style.scss';
import regeneratorRuntime from 'regenerator-runtime';

// header
import './base/header';

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && event.target === document.body) {
        event.preventDefault();
        return false;
    }
});
