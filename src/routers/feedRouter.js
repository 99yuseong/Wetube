import express from "express";
import { explore, showLibrary } from "../controllers/videoController";
import { showSubscriptions } from "../controllers/channelController";

const feed = express.Router();

feed.route("/feed/explore").get(explore);
feed.route("/feed/subscription").get(showSubscriptions);
feed.route("/feed/library").get(showLibrary);

export default feed;
