import { UserType } from './user.interface';
import Conversation from '../conversation/conversation.model';
import User from './user.model';
import ApiError from '../../errors/ApiError';
import { ObjectId } from 'mongoose';

//* Register
export const registerUserDB = async (
  user: Partial<UserType>
): Promise<UserType> => {
  const isExist = await User.findOne({
    username: user.username,
  });

  if (isExist) {
    throw new ApiError(401, `'${user.username}' username already exist`);
  }

  if (!user.username) {
    throw new Error(`Username required`);
  }
  const result = User.create(user);
  return result;
};

//* Login
export const loginDB = async (username: string): Promise<Partial<UserType>> => {
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, `Username of this '${username}' user is not exist`);
  }
  return user;
};

//* Get remaining users, who are not in my conversation
export const getUsersDB = async (
  query: string,
  id: string
): Promise<UserType[]> => {
  const addedUsers = (
    await Conversation.where('participants')
      .in([id])
      .where('isGroup')
      .equals(false)
  ).map(
    conversation =>
      conversation.participants.filter(
        userId => userId.toString() !== id.toString()
      )[0]
  );

  const users = await User.find({
    $and: [
      {
        _id: { $nin: [...addedUsers, id] },
      },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
        ],
      },
    ],
  }).exec();

  return users;
};

//* Get single user
export const getSingleUserDB = async (username: string): Promise<UserType> => {
  const user = await User.findOne({ username: username });
  if (!user) {
    throw new ApiError(404, `Username of this '${username}' user is not exist`);
  }
  return user;
};

//* Get users for join group
export const getMembersDB = async (
  query: string,
  currentUserId: string,
  addedUsers: ObjectId[]
): Promise<UserType[]> => {
  const users = await User.find({
    $and: [
      {
        _id: { $nin: [currentUserId, ...addedUsers] },
      },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { username: { $regex: query, $options: 'i' } },
        ],
      },
    ],
  });

  return users;
};

//* Edit user
export const editUserDB = async (userId: string, data: Partial<UserType>) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, `User not found`);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { ...data },
    { new: true }
  );
  return updatedUser;
};
