import { Model, Schema } from 'mongoose';

export type MessageType = {
  _id?: string;
  sender: {
    name: string;
    id: string;
  };
  receiver: Schema.Types.ObjectId;
  conversationId: Schema.Types.ObjectId;
  message: string;
  img: string;
  timestamp: number;
  replyTo?: Partial<MessageType>;
  status?: string;
  seen?: [Schema.Types.ObjectId];
};

export type MessageModel = Model<MessageType>;
