import mongoose, { Schema } from 'mongoose';
const CommentSchema = new Schema({
    text: {
        type: String,
        required: true,
    }
});
const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    comments: [CommentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});
const PostModel = mongoose.model('Post', PostSchema);
export default PostModel;
//# sourceMappingURL=Post.js.map