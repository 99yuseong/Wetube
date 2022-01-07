import express from "express";
import { explore, showLibrary } from "../controllers/videoController";
import { showSubscriptions } from "../controllers/channelController";
import { protectMiddlware } from "../middleware";

const feed = express.Router();

feed.route("/explore").get(explore);
feed.route("/subscriptions").all(protectMiddlware).get(showSubscriptions);
feed.route("/library").all(protectMiddlware).get(showLibrary);

export default feed;
