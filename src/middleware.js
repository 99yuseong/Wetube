import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

export const localMiddleware = (req, res, next) => {
    res.locals.channel = req.session.channel;
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    next();
};

export const channelOwnerMiddleware = (req, res, next) => {
    const {
        params: { id },
        session: { channel },
    } = req;
    if (channel._id.valueOf() !== id) {
        req.flash('error', 'Not Authorized');
        return res.status(400).redirect(`/channel/${id}`);
    }
    next();
};

export const videoOwnerMiddleware = (req, res, next) => {
    const {
        params: { id },
        session: { channel },
    } = req;

    let videoOwner = false;
    channel.videos.forEach((video_obj_Id) => {
        if (video_obj_Id.valueOf() === id) {
            videoOwner = true;
        }
    });

    if (videoOwner) {
        return next();
    }
    req.flash('error', 'Not Authorized');
    return res.status(400).redirect(`/watch/${id}`);
};

export const protectMiddlware = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    req.flash('error', 'Please Login');
    return res.redirect('/login');
};

export const publicOnlyMiddelware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    }
    req.flash('error', 'Not Authorized');
    return res.redirect('/');
};

export const socialOnlyPreventMiddleware = (req, res, next) => {
    if (!req.session.channel.socialOnly) {
        return next();
    }
    req.flash('error', 'Not Authorized');
    return res.redirect('/');
};

const isHeroku = process.env.NODE_ENV === 'production';

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

const s3Uploader = multerS3({
    s3: s3,
    bucket: 'project-wetube',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        if (file.fieldname === 'video') {
            cb(null, `videos/${file.originalname} - ${Date.now()}`);
        }
        if (file.fieldname === 'thumbnail') {
            cb(null, `thumbnails/${file.originalname} - ${Date.now()}`);
        }
        if (file.fieldname === 'avatar') {
            cb(null, `avatars/${file.originalname} - ${Date.now()}`);
        }
    },
});

const avatarStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, '/avatars' + file.originalname + '-' + Date.now());
    },
});

const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        if (file.fieldname === 'video') {
            cb(null, `/videos/${file.originalname} - ${Date.now()}`);
        }
        if (file.fieldname === 'thumbnail') {
            cb(null, `/thumbnails/${file.originalname} - ${Date.now()}`);
        }
    },
});

export const avatarUpload = multer({
    storage: isHeroku ? s3Uploader : avatarStorage,
});

export const videoUpload = multer({
    storage: isHeroku ? s3Uploader : videoStorage,
});
