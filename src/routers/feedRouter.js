import express from 'express';
import {
    explore,
    showLibrary,
    showYourVideos,
    showLiked,
} from '../controllers/videoController';
import { showSubscriptions } from '../controllers/channelController';
import { protectMiddlware } from '../middleware';

const feed = express.Router();

feed.route('/explore').get(explore);
feed.route('/subscriptions').all(protectMiddlware).get(showSubscriptions);
feed.route('/library').all(protectMiddlware).get(showLibrary);
feed.route('/yourVideo').all(protectMiddlware).get(showYourVideos);
feed.route('/liked').all(protectMiddlware).get(showLiked);

export default feed;
