import express from 'express';
import {
    watchVideo,
    edit,
    reuploadVideo,
    remove,
    watchApi,
} from '../controllers/videoController';
import {
    videoUpload,
    protectMiddlware,
    videoOwnerMiddleware,
} from '../middleware';

const watch = express.Router();

watch.route('/:id').get(watchVideo);
watch.route('/:id/api/:section').all(protectMiddlware).get(watchApi);
watch
    .route('/:id/edit')
    .all(protectMiddlware, videoOwnerMiddleware)
    .get(edit)
    .post(videoUpload.single('thumbnail'), edit);
watch
    .route('/:id/reupload')
    .all(protectMiddlware, videoOwnerMiddleware)
    .get(reuploadVideo)
    .post(videoUpload.single('video'), reuploadVideo);
watch
    .route('/:id/delete')
    .all(protectMiddlware, videoOwnerMiddleware)
    .get(remove);

export default watch;
