import Video from "../models/Video";
import Channel from "../models/Channel";

export const home = async (req, res) => {
    const videos = await Video.find().populate("channel");
    return res.render("watch/home", { videos });
};
export const upload = async (req, res) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    if (req.method === "GET") {
        if (id !== channel._id.valueOf()) {
            console.log("Not channel Owner");
            return res.status(404).redirect("/");
        }
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
        if (!channel.videos.includes(video._id.valueOf())) {
            return res.status(400).redirect(`/watch/${id}`);
        }
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

        req.session.channel.tempReupload = "";
        console.log("saved");
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
        if (!channel.videos.includes(video._id.valueOf())) {
            return res.status(400).redirect(`/watch/${id}`);
        }
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
    if (!channel.videos.includes(video._id.valueOf())) {
        return res.status(400).redirect(`/watch/${id}`);
    }
    await Video.findByIdAndDelete(id);
    return res.status(200).redirect("/");
};

export const search = (req, res) => {};

export const watchVideo = async (req, res) => {
    const {
        params: { id },
    } = req;

    const video = await Video.findById(id).populate("channel");
    if (!video) {
        return res.status(404).render("base/404");
    }
    return res.status(200).render("watch/watch", { video });
};

export const explore = (req, res) => {};

export const showLibrary = (req, res) => {};
