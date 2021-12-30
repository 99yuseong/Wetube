import Video from "../models/Video";

export const upload = (req, res) => {
    if (req.method === "GET") {
        return res.send("upload");
    }
    if (req.method === "POST") {
    }
};

export const home = (req, res) => {
    res.render("watch/home");
};

export const edit = (req, res) => {};

export const remove = (req, res) => {};

export const search = (req, res) => {};

export const watchVideo = (req, res) => {};

export const explore = (req, res) => {};

export const showLibrary = (req, res) => {};
