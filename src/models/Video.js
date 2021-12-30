import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    hashtag: [{ type: String }],
    meta: {
        createdAt: { type: Date, default: Date.now },
        views: { type: Number, default: 0 },
        liked: { type: Number, default: 0 },
        disliked: { type: Number, default: 0 },
    },
    videoUrl: { type: String },
    // channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
