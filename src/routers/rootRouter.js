import express from "express";
import { home, search } from "../controllers/videoController";
import { join, login } from "../controllers/channelController";
import { avatarUpload, publicOnlyMiddelware } from "../middleware";

const root = express.Router();

root.route("/").get(home);
root.route("/join")
    .all(publicOnlyMiddelware)
    .get(join)
    .post(avatarUpload.single("avatar"), join);
root.route("/login").all(publicOnlyMiddelware).get(login).post(login);
root.route("/search").get(search);

export default root;
