import fs from 'fs';
import Video from '../models/Video';
import Channel from '../models/Channel';
import Comment from '../models/Comment';

export const home = async (req, res) => {
    const videos = await Video.find().populate('channel');
    return res.render('watch/home', { videos, pageTitle: 'Youtube' });
};

export const upload = async (req, res) => {
    const {
        params: { id },
    } = req;
    if (req.method === 'GET') {
        return res
            .status(200)
            .render('channel/upload', { pageTitle: 'Upload' });
    }
    if (req.method === 'POST') {
        const {
            body: { title, description, hashtag },
            files,
        } = req;
        const isHeroku = process.env.NODE_ENV === 'production';
        const video = await Video.create({
            title,
            description,
            hashtag: Video.formatHashtag(hashtag),
            videoUrl: isHeroku ? files.video[0].location : files.video[0].path,
            thumbUrl: isHeroku
                ? files.thumbnail[0].location
                : files.thumbnail[0].path,
            channel: id,
        });
        // DB
        const uploadChannel = await Channel.findById(id);
        uploadChannel.videos.push(video._id);
        uploadChannel.save();
        // session
        req.session.channel.videos.push(video._id);
        req.flash('success', 'Video Successfully Uploaded');
        return res.status(201).redirect(`/watch/${video._id}`);
    }
};

export const edit = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    const video = await Video.findById(id);

    if (req.method === 'GET') {
        return res
            .status(200)
            .render('watch/edit', { video, pageTitle: 'Upload' });
    }

    if (req.method === 'POST') {
        const {
            body: { title, description, hashtag },
            file,
        } = req;
        const isHeroku = process.env.NODE_ENV === 'production';
        const editedVideo = await Video.findByIdAndUpdate(
            id,
            {
                title,
                description,
                hashtag: Video.formatHashtag(hashtag),
                videoUrl: channel.tempReupload
                    ? channel.tempReupload
                    : video.videoUrl,
                thumbUrl: file
                    ? isHeroku
                        ? file.location
                        : file.path
                    : video.thumbUrl,
            },
            {
                new: true,
            }
        );

        if (file) {
            fs.rm(`${video.thumbUrl}`, (err) => {
                console.log('thumbUrl_file_Edit : ' + err);
            });
        }
        if (channel.tempReupload) {
            fs.rm(`${video.videoUrl}`, (err) => {
                console.log('videoUrl_file_Edit : ' + err);
            });
        }
        req.session.channel.tempReupload = '';
        req.flash('success', 'Successfully Saved');
        return res.status(200).redirect(`/watch/${id}/edit`);
    }
};
export const reuploadVideo = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    const video = await Video.findById(id);
    if (req.method === 'GET') {
        return res
            .status(200)
            .render('watch/reupload', { video, pageTitle: 'Reupload' });
    }
    if (req.method === 'POST') {
        const { file } = req;
        channel.tempReupload = file.path;
        return res.status(201).redirect(`/watch/${id}/edit`);
    }
};

export const remove = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    const deletedVideo = await Video.findByIdAndDelete(id);

    const videoChannel = await Channel.findById(channel._id);
    const index = videoChannel.videos.indexOf(deletedVideo._id);
    videoChannel.videos.splice(index, 1);
    videoChannel.save();

    fs.rm(`${deletedVideo.videoUrl}`, (err) => {
        console.log('videoUrl_file_delete : ' + err);
    });
    fs.rm(`${deletedVideo.thumbUrl}`, (err) => {
        console.log('thumbUrl_file_delete : ' + err);
    });
    req.flash('success', 'Permanently Deleted');
    return res.status(200).redirect('/');
};

export const watchVideo = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    const videos = await Video.find();
    const video = await Video.findById(id)
        .populate('channel')
        .populate('comments');
    if (!video) {
        return res.status(404).render('base/404');
    }
    return res
        .status(200)
        .render('watch/watch', { videos, video, pageTitle: `${video.title}` });
};

export const search = async (req, res) => {
    const {
        query: { keyword },
    } = req;
    const searchedVideo = await Video.find({
        title: { $regex: new RegExp(`${keyword}`, 'i') },
    }).populate('channel');
    return res.render('watch/home', {
        keyword,
        videos: searchedVideo,
        pageTitle: `Search - ${keyword}`,
    });
};

export const explore = async (req, res) => {
    const videos = await Video.find().populate('channel');
    return res
        .status(200)
        .render('feed/explore', { videos, pageTitle: 'Explore' });
};

export const showLibrary = async (req, res) => {
    const {
        session: {
            channel: { library },
        },
    } = req;

    let videos = [];

    for (let element of library) {
        const savedVideo = await Video.findById(element).populate('channel');
        videos.push(savedVideo);
    }

    return res
        .status(200)
        .render('feed/library', { videos, pageTitle: 'Library' });
};

export const showYourVideos = async (req, res) => {
    const {
        session: {
            channel: { videos },
        },
    } = req;

    let myVideos = [];

    for (let element of videos) {
        const myVideo = await Video.findById(element).populate('channel');
        myVideos.push(myVideo);
    }

    return res.status(200).render('feed/yourVideo', {
        videos: myVideos,
        pageTitle: 'Your Videos',
    });
};

export const showLiked = async (req, res) => {
    const {
        session: {
            channel: { liked },
        },
    } = req;

    let videos = [];

    for (let element of liked) {
        const likedVideo = await Video.findById(element).populate('channel');
        videos.push(likedVideo);
    }

    return res
        .status(200)
        .render('feed/liked', { videos, pageTitle: 'Liked Video' });
};

const saveClickedBtn = async (btn, user, video, session) => {
    // find user's saved Array
    const saveArray = user[`${btn}`];
    // check whether user saved this video
    const saved = saveArray.indexOf(video._id);
    let savedBoolean;
    if (saved === -1) {
        // if not saved, push to array
        saveArray.push(video._id);
        video.meta[btn] += 1;
        savedBoolean = true;
    } else {
        // already saved, remove from array
        saveArray.splice(saved, 1);
        video.meta[btn] -= 1;
        savedBoolean = false;
    }
    // update session data and server data
    await video.save();
    session.channel = await user.save();
    return savedBoolean;
};

export const watchApi = async (req, res) => {
    const {
        params: { id, section },
        session: {
            channel: { _id },
        },
    } = req;

    const user = await Channel.findById(_id);
    const video = await Video.findById(id);

    if (section === 'views') {
        video.meta.views += 1;
        video.save();
        return res.sendStatus(200);
    }

    if (section === 'liked') {
        const saved = await saveClickedBtn(section, user, video, req.session);
        return res.json({ saved });
    }

    if (section === 'disliked') {
        const saved = await saveClickedBtn(section, user, video, req.session);
        return res.json({ saved });
    }

    if (section === 'library') {
        const saved = user.library.indexOf(video._id);
        // retrun Boolean
        let savedBoolean;
        if (saved === -1) {
            // if not saved, push to array
            user.library.push(video._id);
            savedBoolean = true;
        } else {
            // if already saved, remove from array
            user.library.splice(saved, 1);
            savedBoolean = false;
        }
        req.session.channel = await user.save();
        return res.json({ saved: savedBoolean });
    }

    if (section === 'addComment') {
        const {
            body: { comment },
        } = req;

        const newComment = await Comment.create({
            comment,
            channel: user._id,
            name: user.name,
            avatarUrl: user.avatarUrl,
            video: video._id,
        });
        user.comments.push(newComment._id);
        user.save();
        video.comments.push(newComment._id);
        video.save();
        return res.json({ newComment });
    }

    if (section === 'delComment') {
        const {
            body: { deletingComment },
        } = req;

        const comment = await Comment.findByIdAndDelete(deletingComment);
        const commentChannel = await Channel.findById(comment.channel);

        // delete comment id in Channel data
        const channelCommentIndex = commentChannel.comments.findIndex(
            (element) => element.valueOf() === deletingComment
        );
        commentChannel.comments.splice(channelCommentIndex, 1);
        commentChannel.save();

        // delete comment id in video data
        const videoCommentIndex = video.comments.findIndex(
            (element) => element.valueOf() === deletingComment
        );
        video.comments.splice(videoCommentIndex, 1);
        video.save();
        return res.sendStatus(200);
    }
};
