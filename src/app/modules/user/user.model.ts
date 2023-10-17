import { Schema, model } from 'mongoose';
import { UserModel, UserType } from './user.interface';

const UserSchema = new Schema<UserType>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String },
  img: { type: String },
  bio: { type: String },
  color: { type: String },
  status: { type: String, default: 'online' },
  lastActive: { type: Number || null },
});

const User = model<UserType, UserModel>('User', UserSchema);
export default User;
