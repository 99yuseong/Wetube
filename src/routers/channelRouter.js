import express from "express";
import { upload } from "../controllers/videoController";
import {
    showChannel,
    edit,
    remove,
    logout,
} from "../controllers/channelController";

const channel = express.Router();

channel.route("/channel/:id").get(showChannel);
channel.route("/channel/:id/edit").get(edit).post(edit);
channel.route("/channel/:id/delete").get(remove);
channel.route("/channel/:id/logout").get(logout);
channel.route("/channel/:id/upload").get(upload).post(upload);

export default channel;
