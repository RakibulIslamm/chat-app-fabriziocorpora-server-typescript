import { Schema, model } from 'mongoose';
import { MessageModel, MessageType } from './message.interface';
import User from '../user/user.model';

const MessageSchema = new Schema<MessageType>({
  sender: {
    name: String,
    id: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  message: { type: String },
  img: { type: String },
  timestamp: { type: Number },
  replyTo: {
    _id: String,
    message: String,
    img: String,
  },
  status: { type: String },
  seen: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Message = model<MessageType, MessageModel>('Message', MessageSchema);
export default Message;
