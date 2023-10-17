import { Model, Schema } from 'mongoose';

export type ConversationType = {
  isGroup: true | false;
  groupName?: string;
  groupCreator?: Schema.Types.ObjectId;
  groupColor?: string;
  participants: [Schema.Types.ObjectId];
  sender: Schema.Types.ObjectId;
  lastMessage?: string;
  img: boolean;
  timestamp: number;
};

export type ConversationModel = Model<ConversationType>;
