import { Model, Schema } from 'mongoose';

export type MessageType = {
  _id?: string;
  messageId: string;
  sender: {
    name: string;
    id: string;
  };
  conversationId: Schema.Types.ObjectId;
  message: string;
  img: string;
  file?: {
    type: string;
    name: string;
    link: string;
  };
  forGroup: boolean;
  newGroup?: {
    groupCreator: string;
    addedMembers: string[];
  };
  addMembers?: {
    addedBy: string;
    addedMembers: string[];
  };
  joinGroup?: string;
  timestamp: number;
  replyTo?: Partial<MessageType>;
  status?: string;
  seen?: [Schema.Types.ObjectId];
};

export type MessageModel = Model<MessageType>;
