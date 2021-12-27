import express from "express";
import { watchVideo, edit, remove } from "../controllers/videoController";

const watch = express.Router();

watch.route("/watch/:id").get(watchVideo);
watch.route("/watch/:id/edit").get(edit).post(edit);
watch.route("/watch/:id/delete").get(remove);

export default watch;
