import express from "express";
import { explore, showLibrary } from "../controllers/videoController";
import { showSubscriptions } from "../controllers/channelController";

const feed = express.Router();

feed.route("/explore").get(explore);
feed.route("/subscription").get(showSubscriptions);
feed.route("/library").get(showLibrary);

export default feed;
