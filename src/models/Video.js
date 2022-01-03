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
    videoUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
});

videoSchema.static("formatHashtag", function (hashtags) {
    return hashtags
        .split(",")
        .map((hashtag) =>
            hashtag.trim().startsWith("#")
                ? hashtag.trim()
                : "#" + hashtag.trim()
        );
});

const Video = mongoose.model("Video", videoSchema);
export default Video;
