import mongoose, { Schema, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  userRole: 'admin' | 'user'; 
}

const UserSchema: Schema<UserDocument> = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;
