import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import {
  editUserDB,
  getMembersDB,
  getSingleUserDB,
  getUsersDB,
  loginDB,
  registerUserDB,
} from './user.services';
import ApiError from '../../errors/ApiError';
import { sendResponse } from '../../utils/sendResponse';
import { UserType } from './user.interface';
import Conversation from '../conversation/conversation.model';
import mongoose, { ObjectId } from 'mongoose';

// Register
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body;
  try {
    const newUser = await registerUserDB(user);
    sendResponse<UserType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: newUser,
      meta: null,
      message: 'Registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.body;
  try {
    const user = await loginDB(username);
    sendResponse<Partial<UserType>>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: user,
      meta: null,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get remaining users, who are not in my conversation
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.q;
  const currentUser = req.query.id;
  try {
    if (!currentUser) {
      throw new ApiError(400, 'User id not found');
    }
    const users = await getUsersDB(query as string, currentUser as string);

    sendResponse<UserType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: users,
      meta: null,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(next);
  }
};

// Get users for group invite
export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const query = req.query.q;
  const currentUser = req.query.id;
  const conversationId = req.query.conversationId;
  let addedUsers: ObjectId[];
  try {
    if (conversationId) {
      const isValid = mongoose.Types.ObjectId.isValid(conversationId as string);
      if (isValid) {
        const conversation = await Conversation.findById(conversationId);
        addedUsers = conversation ? conversation?.participants : [];
      } else {
        addedUsers = [];
      }
    } else {
      addedUsers = [];
    }
    const users = await getMembersDB(
      query as string,
      currentUser as string,
      addedUsers as ObjectId[]
    );
    sendResponse<UserType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: users,
      meta: null,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
export const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const username = req.query.username;
  try {
    if (!username) {
      throw new ApiError(400, 'Username required');
    }
    const user = await getSingleUserDB(username as string);
    sendResponse<UserType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: user,
      meta: null,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    next(next);
  }
};

// Edit user
export const editUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.query.id;
  const data = req.body;
  try {
    if (!userId) {
      throw new ApiError(400, 'User id required');
    }
    const user = await editUserDB(userId as string, data);
    sendResponse<UserType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: user,
      meta: null,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(next);
  }
};
