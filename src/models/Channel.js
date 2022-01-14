import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const channelSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, default: false },
    socialOnly: { type: Boolean },
    socialLogin: { type: String },
    name: { type: String, required: true, unique: true },
    avatarUrl: {
        type: String,
        default: 'uploads/avatar/Default Avatar.png',
    },
    description: { type: String },
    subscribed: { type: Number, default: 0 },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    subscription: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
            avatarUrl: { type: String },
            name: { type: String },
        },
    ],
    liked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    disliked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    library: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

channelSchema.static('pwHash', async function (password) {
    const pw = await bcrypt.hash(password, 5);
    return pw;
});

channelSchema.static('pwCheck', async function (pw, hashedpw) {
    const match = await bcrypt.compare(pw, hashedpw);
    return match;
});

const Channel = mongoose.model('Channel', channelSchema);
export default Channel;
