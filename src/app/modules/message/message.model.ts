import { Schema, model } from 'mongoose';
import { MessageModel, MessageType } from './message.interface';

const MessageSchema = new Schema<MessageType>({
  messageId: { type: String, required: true },
  sender: {
    name: { type: String },
    id: { type: Schema.Types.ObjectId },
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  message: { type: String },
  img: { type: String },
  file: {
    name: { type: String },
    type: { type: String },
    link: { type: String },
  },
  forGroup: { type: Boolean, default: false },
  newGroup: {
    groupCreator: { type: Schema.Types.ObjectId, ref: 'User' },
    addedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  addMembers: {
    addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    addedMembers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  joinGroup: { type: Schema.Types.ObjectId, ref: 'User' },
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
