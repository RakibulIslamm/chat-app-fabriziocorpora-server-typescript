import { Model, Schema } from 'mongoose';

export type MessageType = {
  _id?: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  conversationId: Schema.Types.ObjectId;
  message: string;
  img: string;
  timestamp: number;
  replyTo?: MessageType;
  status?: string;
  seen?: [Schema.Types.ObjectId];
};

export type MessageModel = Model<MessageType>;
