import express from "express";
import { avatarUpload, videoUpload } from "../middleware";
import { upload } from "../controllers/videoController";
import {
    showChannel,
    edit,
    remove,
    logout,
    changePassword,
} from "../controllers/channelController";

const channel = express.Router();

channel.route("/:id").get(showChannel);
channel.route("/:id/edit").get(edit).post(avatarUpload.single("avatar"), edit);
channel.route("/:id/changePassword").get(changePassword).post(changePassword);
channel.route("/:id/deleteChannel").get(remove).post(remove);
channel.route("/:id/logout").get(logout);
channel
    .route("/:id/upload")
    .get(upload)
    .post(videoUpload.single("video"), upload);

export default channel;
