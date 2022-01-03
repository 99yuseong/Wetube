import express from "express";
import {
    watchVideo,
    edit,
    reuploadVideo,
    remove,
} from "../controllers/videoController";
import { videoUpload, protectMiddlware } from "../middleware";

const watch = express.Router();

watch.route("/:id").get(watchVideo);
watch
    .route("/:id/edit")
    .all(protectMiddlware)
    .get(edit)
    .post(videoUpload.single("thumbnail"), edit);
watch
    .route("/:id/reupload")
    .all(protectMiddlware)
    .get(reuploadVideo)
    .post(videoUpload.single("video"), reuploadVideo);
watch.route("/:id/delete").all(protectMiddlware).get(remove);

export default watch;
