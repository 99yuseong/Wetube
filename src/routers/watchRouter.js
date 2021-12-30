import express from "express";
import { watchVideo, edit, remove } from "../controllers/videoController";
import { videoUpload } from "../middleware";

const watch = express.Router();

watch.route("/:id").get(watchVideo);
watch.route("/:id/edit").get(edit).post(videoUpload.single("video"), edit);
watch.route("/:id/delete").get(remove);

export default watch;
