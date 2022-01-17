import express from 'express';
import {
    avatarUpload,
    videoUpload,
    protectMiddlware,
    channelOwnerMiddleware,
    socialOnlyPreventMiddleware,
} from '../middleware';
import { upload } from '../controllers/videoController';
import {
    showChannel,
    edit,
    remove,
    logout,
    changePassword,
    editCheck,
    subscribe,
    checkPassword,
} from '../controllers/channelController';

const channel = express.Router();

channel.route('/:id/subscribe').get(subscribe);
channel.route('/:id').get(showChannel);
channel
    .route('/:id/edit')
    .all(protectMiddlware, channelOwnerMiddleware)
    .get(edit)
    .post(avatarUpload.single('avatar'), edit);
channel.post('/:id/edit/:section', editCheck);
channel
    .route('/:id/changePassword')
    .all(protectMiddlware, socialOnlyPreventMiddleware, channelOwnerMiddleware)
    .get(changePassword)
    .post(changePassword);
channel.route('/:id/changePassword/check').post(checkPassword);
channel
    .route('/:id/deleteChannel')
    .all(protectMiddlware, channelOwnerMiddleware)
    .get(remove)
    .post(remove);
channel
    .route('/:id/logout')
    .all(protectMiddlware, channelOwnerMiddleware)
    .get(logout);
channel
    .route('/:id/upload')
    .all(protectMiddlware, channelOwnerMiddleware)
    .get(upload)
    .post(
        videoUpload.fields([
            { name: 'video', maxCount: 1 },
            { name: 'thumbnail', maxCount: 1 },
        ]),
        upload
    );

export default channel;
