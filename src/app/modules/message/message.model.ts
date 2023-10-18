import { Schema, model } from 'mongoose';
import { MessageModel, MessageType } from './message.interface';

const MessageSchema = new Schema<MessageType>({
  sender: {
    name: String,
    id: String,
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
