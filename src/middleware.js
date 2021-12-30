import multer from "multer";

export const localMiddleware = (req, res, next) => {
    res.locals.channel = req.session.channel;
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    next();
};

export const protectMiddlware = (req, res, next) => {};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            "/" + file.fieldname + "/" + file.originalname + "-" + Date.now()
        );
    },
});

export const avatarUpload = multer({
    storage,
});

export const videoUpload = multer({
    storage,
});
