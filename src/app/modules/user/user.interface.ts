import { Model } from 'mongoose';

export type UserType = {
  _id?: string;
  name: string;
  username: string;
  email?: string;
  img?: string;
  bio?: string;
  color?: string;
  status: 'online' | 'offline';
  lastActive?: number | null;
};

export type UserModel = Model<UserType>;
