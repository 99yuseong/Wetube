import fs from "fs";
import Video from "../models/Video";
import Channel from "../models/Channel";

export const home = async (req, res) => {
    const videos = await Video.find().populate("channel");
    return res.render("watch/home", { videos });
};
export const upload = async (req, res) => {
    const {
        params: { id },
    } = req;
    if (req.method === "GET") {
        return res.status(200).render("channel/upload");
    }
    if (req.method === "POST") {
        const {
            body: { title, description, hashtag },
            files,
        } = req;

        const video = await Video.create({
            title,
            description,
            hashtag: Video.formatHashtag(hashtag),
            videoUrl: files.video[0].path,
            thumbUrl: files.thumbnail[0].path,
            channel: id,
        });
        // DB
        const uploadChannel = await Channel.findById(id);
        uploadChannel.videos.push(video._id);
        uploadChannel.save();
        // session
        req.session.channel.videos.push(video._id);
        req.flash("success", "Video Successfully Uploaded");
        return res.status(201).redirect(`/watch/${video._id}`);
    }
};

export const edit = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    const video = await Video.findById(id);

    if (req.method === "GET") {
        return res.status(200).render("watch/edit", { video });
    }

    if (req.method === "POST") {
        const {
            body: { title, description, hashtag },
            file,
        } = req;

        const editedVideo = await Video.findByIdAndUpdate(
            id,
            {
                title,
                description,
                hashtag: Video.formatHashtag(hashtag),
                videoUrl: channel.tempReupload
                    ? channel.tempReupload
                    : video.videoUrl,
                thumbUrl: file ? file.path : video.thumbUrl,
            },
            {
                new: true,
            }
        );

        if (file) {
            fs.rm(`${video.thumbUrl}`, (err) => {
                console.log("thumbUrl_file_Edit : " + err);
            });
        }
        if (channel.tempReupload) {
            fs.rm(`${video.videoUrl}`, (err) => {
                console.log("videoUrl_file_Edit : " + err);
            });
        }
        req.session.channel.tempReupload = "";
        req.flash("success", "Successfully Saved");
        return res.status(200).redirect(`/watch/${id}/edit`);
    }
};
export const reuploadVideo = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    const video = await Video.findById(id);
    if (req.method === "GET") {
        return res.status(200).render("watch/reupload", { video });
    }
    if (req.method === "POST") {
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
        console.log("videoUrl_file_delete : " + err);
    });
    fs.rm(`${deletedVideo.thumbUrl}`, (err) => {
        console.log("thumbUrl_file_delete : " + err);
    });
    req.flash("success", "Permanently Deleted");
    return res.status(200).redirect("/");
};

export const watchVideo = async (req, res) => {
    const {
        params: { id },
    } = req;

    const video = await Video.findById(id).populate("channel");
    if (!video) {
        return res.status(404).render("base/404");
    }
    console.log(video);
    return res.status(200).render("watch/watch", { video });
};

export const search = async (req, res) => {
    const {
        query: { keyword },
    } = req;
    const searchedVideo = await Video.find({
        title: { $regex: new RegExp(`${keyword}`, "i") },
    });
    return res.render("watch/home", { videos: searchedVideo });
};

export const explore = (req, res) => {
    let videos = [];
    // subscription array > name find
    // const subscriptions = await Channel.find({ name });

    return res.status(200).render("feed/explore", { videos });
};

export const showLibrary = (req, res) => {
    const {
        session: {
            channel: { library },
        },
    } = req;

    let videos = [];
    // library array > name find
    // const library = await Channel.find({ name });

    return res.status(200).render("feed/library", { videos });
};
