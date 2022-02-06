import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    name: { type: String },
    avatarUrl: { type: String },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
