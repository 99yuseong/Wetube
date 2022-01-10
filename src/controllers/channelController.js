import fs from 'fs';
import fetch from 'node-fetch';
import Video from '../models/Video';
import Channel from '../models/Channel';

export const join = async (req, res) => {
    if (req.method === 'GET') {
        return res.render('channel/join');
    }

    if (req.method === 'POST') {
        const {
            body: { email, password, password2, name, description },
            file,
        } = req;

        // const emailCheck = await Channel.findOne({
        //     email,
        // });
        // if (emailCheck) {
        //     if (channel.socialOnly && channel.socialLogin === 'Github') {
        //         req.flash('error', 'You already joined with Github');
        //         return res.status(400).redirect('/login');
        //     }
        //     if (channel.socialOnly && channel.socialLogin === 'Naver') {
        //         req.flash('error', 'You already joined with Naver');
        //         return res.status(400).redirect('/login');
        //     }
        //     req.flash('error', 'Email is already taken');
        //     return res.status(400).redirect('/join');
        // }

        // const nameCheck = await Channel.exists({ name });
        // if (nameCheck) {
        //     req.flash('error', 'Channel name is already taken');
        //     return res.status(400).redirect('/join');
        // }

        // if (password !== password2) {
        //     req.flash('error', 'Password confirmation error');
        //     return res.status(400).redirect('/join');
        // }

        await Channel.create({
            email,
            password: await Channel.pwHash(password),
            name,
            avatarUrl: file ? file.path : 'uploads/avatars/Default Avatar.png',
            description,
        });
        req.flash('success', 'Successfully Joined! Please login');
        return res.status(201).redirect('/login');
    }
};

export const joinCheck = async (req, res) => {
    const {
        body,
        params: { section },
    } = req;

    if (section === 'email') {
        const checkingChannel = await Channel.exists({ email: body.email });
        if (checkingChannel) {
            return res.json({ email: 'taken' });
        } else {
            return res.json({ email: 'valid' });
        }
    }

    if (section === 'name') {
        const checkingChannel = await Channel.exists({ name: body.name });
        if (checkingChannel) {
            return res.json({ name: 'taken' });
        } else {
            return res.json({ name: 'valid' });
        }
    }
};

export const loginGithub = (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        scope: 'read:user user:email',
        allow_signup: true,
    };
    const params = new URLSearchParams(config).toString();
    const totalUrl = `${baseUrl}?${params}`;
    return res.redirect(totalUrl);
};

export const loginCompleteGithub = async (req, res) => {
    const baseUrl = 'https://github.com/login/oauth/access_token';
    const config = {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code,
    };
    const params = new URLSearchParams(config).toString();
    const totalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(totalUrl, {
            method: 'POST',
            headers: { Accept: 'application/json' },
        })
    ).json();

    if ('access_token' in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = 'https://api.github.com';
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: { Authorization: `token ${access_token}` },
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: { Authorization: `token ${access_token}` },
            })
        ).json();

        const emailObj = emailData.find(
            (element) => element.primary === true && element.verified === true
        );
        if (!emailObj) {
            req.flash('error', 'Can not Login with Github');
            return res.status(400).redirect('/login');
        }
        let channel = await Channel.findOne({ email: emailObj.email });
        if (!channel) {
            channel = await Channel.create({
                email: emailObj.email,
                socialOnly: true,
                socialLogin: 'Github',
                name: userData.name,
                avatarUrl: userData.avatar_url,
            });
        }
        req.session.loggedIn = true;
        req.session.channel = channel;
        return res.status(200).redirect('/');
    } else {
        req.flash('error', 'Can not Login with Github');
        return res.status(404).redirect('/');
    }
};

export const loginNaver = (req, res) => {
    const baseUrl = 'https://nid.naver.com/oauth2.0/authorize';
    const config = {
        response_type: 'code',
        client_id: process.env.NAVER_CLIENT_ID,
        redirect_uri: 'http://localhost:3000/socialLogin/naver/complete',
        state: process.env.NAVER_STATE,
    };
    const params = new URLSearchParams(config).toString();
    const totalUrl = `${baseUrl}?${params}`;
    return res.redirect(totalUrl);
};
export const loginCompleteNaver = async (req, res) => {
    const baseUrl = 'https://nid.naver.com/oauth2.0/token';
    const config = {
        grant_type: 'authorization_code',
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code: req.query.code,
        state: req.query.state,
    };
    const params = new URLSearchParams(config).toString();
    const totalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await (
        await fetch(totalUrl, {
            method: 'POST',
        })
    ).json();
    console.log(tokenRequest);

    if ('access_token' in tokenRequest) {
        const { access_token, token_type } = tokenRequest;
        const apiUrl = 'https://openapi.naver.com/v1/nid/me';

        const { response } = await (
            await fetch(apiUrl, {
                headers: { Authorization: `${token_type} ${access_token}` },
            })
        ).json();
        let channel = await Channel.findOne({ email: response.email });
        if (!channel) {
            channel = await Channel.create({
                email: response.email,
                socialOnly: true,
                socialLogin: 'naver',
                name: response.name,
                avatarUrl: response.profile_image,
            });
        }
        req.session.loggedIn = true;
        req.session.channel = channel;
        return res.status(200).redirect('/');
    } else {
        req.flash('error', 'Can not Login with Naver');
        return res.status(404).redirect('/');
    }
};

export const login = async (req, res) => {
    if (req.method === 'GET') {
        return res.status(200).render('channel/login');
    }
    if (req.method === 'POST') {
        const {
            body: { email, password },
        } = req;

        const channel = await Channel.findOne({ email });
        if (!channel) {
            req.flash('error', 'email do not exists');
            return res.status(400).redirect('/login');
        }
        const match = await Channel.pwCheck(password, channel.password);
        if (!match) {
            req.flash('error', 'password is not correct');
            return res.status(400).redirect('login');
        }

        req.session.channel = channel;
        req.session.loggedIn = true;
        return res.status(200).redirect('/');
    }
};

export const edit = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    if (req.method === 'GET') {
        return res.status(200).render('channel/edit', { channel });
    }

    if (req.method === 'POST') {
        const {
            body: { name, description },
            file,
        } = req;

        const nameExists = await Channel.findOne({ name });
        if (nameExists && id !== nameExists._id.valueOf()) {
            req.flash('error', 'Channel name already Exists');
            return res.status(400).redirect('edit');
        }

        const editedChannel = await Channel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                avatarUrl: file ? file.path : channel.avatarUrl,
            },
            { new: true }
        );

        req.session.channel = editedChannel;
        if (
            file &&
            channel.avatarUrl !== 'uploads/avatars/Default Avatar.png'
        ) {
            fs.rm(`${channel.avatarUrl}`, (err) => {
                console.log(err);
            });
        }
        req.flash('success', 'Successfully Saved');
        return res.status(200).redirect('edit');
    }
};

export const editCheck = async (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    const nameExist = await Channel.findOne({ name: body.name });
    if (nameExist && nameExist._id.valueOf() !== id) {
        return res.json({ name: 'taken' });
    }
    return res.json({ name: 'valid' });
};

export const changePassword = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    if (req.method === 'GET') {
        return res.status(200).render('channel/changePassword');
    }
    if (req.method === 'POST') {
        const {
            body: { old, new1, new2 },
        } = req;

        const channel = await Channel.findById(id);
        const match = await Channel.pwCheck(old, channel.password);

        if (!match) {
            req.flash('error', 'Wrong password');
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        if (new1 !== new2) {
            req.flash('error', 'Password confirmation error');
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        if (old === new1) {
            req.flash('error', 'New password should be different');
            return res.status(400).redirect(`/channel/${id}/changePassword`);
        }
        channel.password = await Channel.pwHash(new1);
        channel.save();
        req.flash('success', 'Password changed');
        return res.status(200).redirect(`/channel/${id}/edit`);
    }
};

export const showChannel = async (req, res) => {
    const {
        params: { id },
    } = req;
    const showingChannel = await Channel.findById(id).populate('videos');
    return res.status(200).render('channel/channel', { showingChannel, id });
};

export const remove = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    if (req.method === 'GET') {
        return res.status(200).render('channel/remove');
    }
    if (req.method === 'POST') {
        const {
            body: { remove },
        } = req;
        if (remove !== channel.name) {
            req.flash('error', 'Check you enter correctly');
            return res.status(404).redirect('deleteChannel');
        }

        const delChannel = await Channel.findByIdAndDelete(id);

        if (delChannel.avatarUrl !== 'uploads/avatars/Default Avatar.png') {
            fs.rm(`${channel.avatarUrl}`, (err) => {
                console.log('avatarUrl' + err);
            });
        }

        delChannel.videos.forEach(async (video_id) => {
            const deletedVideo = await Video.findByIdAndDelete(video_id);
            fs.rm(`${deletedVideo.videoUrl}`, (err) => {
                console.log('videoUrl' + err);
            });
            fs.rm(`${deletedVideo.thumbUrl}`, (err) => {
                console.log('thumbUrl' + err);
            });
        });

        req.session.destroy();
        req.flash('success', 'Your Channel is permanently deleted');
        return res.redirect('/');
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

export const showSubscriptions = async (req, res) => {
    const {
        session: {
            channel: { suscription },
        },
    } = req;

    let videos = [];
    // subscription array > name find
    // const subscriptions = await Channel.find({ name });

    return res.status(200).render('feed/subscriptions', { videos });
};
