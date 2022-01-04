import express from "express";
import { publicOnlyMiddelware } from "../middleware";
import {
    loginGithub,
    loginCompleteGithub,
    loginNaver,
    loginCompleteNaver,
} from "../controllers/channelController";

const social = express.Router();

social.route("/github").all(publicOnlyMiddelware).get(loginGithub);
social
    .route("/github/complete")
    .all(publicOnlyMiddelware)
    .get(loginCompleteGithub);
social.route("/naver").all(publicOnlyMiddelware).get(loginNaver);
social
    .route("/naver/complete")
    .all(publicOnlyMiddelware)
    .get(loginCompleteNaver);

export default social;
