import { Model, Schema } from 'mongoose';

export type ConversationType = {
  isGroup: true | false;
  groupName?: string;
  groupCreator?: Schema.Types.ObjectId;
  groupColor?: string;
  participants: [Schema.Types.ObjectId];
  sender: string;
  lastMessage?: string;
  img?: boolean;
  file?: boolean;
  timestamp: number;
  unseenMessages: number;
};

export type ConversationModel = Model<ConversationType>;
