import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
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
const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
//# sourceMappingURL=User.js.map