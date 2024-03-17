import mongoose, { Schema, Document } from 'mongoose';

export interface MessageDocument extends Document{
    name: string;
    email: string;
    message:string;
  }

  const MessageSchema: Schema<MessageDocument> = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        require: true,
    },
    message:{
        type: String,
        require: true,
    }
  })
  const messageModel=mongoose.model<MessageDocument>('Message', MessageSchema);

  export default messageModel;