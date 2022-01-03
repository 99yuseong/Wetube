import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.channel = req.session.channel;
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    next();
};

export const protectMiddlware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    console.log("Please Login");
    return res.redirect("/login");
};

export const publicOnlyMiddelware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    }
    console.log("Not authorized");
    return res.redirect("/");
};

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, "/" + file.originalname + "-" + Date.now());
    },
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        if (file.fieldname === "video") {
            cb(null, `/videos/${file.originalname} - ${Date.now()}`);
        }
        if (file.fieldname === "thumbnail") {
            cb(null, `/thumbnails/${file.originalname} - ${Date.now()}`);
        }
    },
});

export const avatarUpload = multer({
    storage: avatarStorage,
});

export const videoUpload = multer({
    storage: videoStorage,
});
