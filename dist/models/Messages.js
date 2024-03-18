import mongoose, { Schema } from 'mongoose';
const MessageSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
    }
});
const messageModel = mongoose.model('Message', MessageSchema);
export default messageModel;
//# sourceMappingURL=Messages.js.map