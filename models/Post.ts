import mongoose, { Schema, Document } from 'mongoose';

interface Comment {
  text: string;
}

export interface PostDocument extends Document {
  title: string;
  body: string;
  likes: number;
  comments: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CommentSchema: Schema<Comment> = new Schema({
  text: {
    type: String,
    required: true,
  }
});

const PostSchema: Schema<PostDocument> = new Schema({
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

const PostModel = mongoose.model<PostDocument>('Post', PostSchema);

export default PostModel;
