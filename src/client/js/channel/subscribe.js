const subscribeBtn = document.querySelector('.subscribe-button');
const subscribers = document.querySelector('.subscribers');
const navsubscription = document.querySelector('.nav-subscriptions');

const showSubscriptionAtNav = (subscribed, _id, name, avatarUrl) => {
    if (subscribed) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const img = document.createElement('img');
        const span = document.createElement('span');
        li.setAttribute('id', _id);
        a.setAttribute('href', `/channel/${_id}`);
        img.setAttribute(
            'src',
            `${avatarUrl.startsWith('https') ? avatarUrl : '/' + avatarUrl}`
        );
        img.setAttribute('alt', `${name}의 avatar image`);
        span.innerText = name;
        a.appendChild(img);
        a.appendChild(span);
        li.appendChild(a);
        navsubscription.prepend(li);
    } else {
        const unsubscribedChannel = document.getElementById(_id);
        unsubscribedChannel.remove();
    }
};

const subscribe = async (event) => {
    const channelId = event.target.dataset._id;
    const { subscribed, _id, name, avatarUrl } = await (
        await fetch(`/channel/${channelId}/subscribe`, {
            method: 'GET',
        })
    ).json();

    event.target.innerText = subscribed ? 'Subscribed' : 'Subscribe';
    event.target.classList.toggle('subscribed');
    subscribers.innerText = subscribed
        ? Number(subscribers.innerText) + 1
        : Number(subscribers.innerText) - 1;

    showSubscriptionAtNav(subscribed, _id, name, avatarUrl);
};

if (subscribeBtn) {
    subscribeBtn.addEventListener('click', subscribe);
}
