import { Schema, model } from 'mongoose';
import { ConversationModel, ConversationType } from './conversation.interface';

const ConversationSchema = new Schema<ConversationType>({
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupCreator: { type: Schema.Types.ObjectId, ref: 'User' },
  groupColor: { type: String },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  sender: {
    type: String,
  },
  lastMessage: { type: String },
  img: { type: Boolean },
  timestamp: { type: Number },
  unseenMessages: { type: Number },
});

const Conversation = model<ConversationType, ConversationModel>(
  'Conversation',
  ConversationSchema
);
export default Conversation;
