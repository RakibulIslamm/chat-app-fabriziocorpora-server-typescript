import { NextFunction, Request, Response } from 'express';
import {
  deleteAllMessageDB,
  deleteMessageDB,
  getMessagesDB,
  getMoreMessagesDB,
  sendMessageDB,
} from './message.services';
import { sendResponse } from '../../utils/sendResponse';
import { MessageType } from './message.interface';
import httpStatus from 'http-status';
import Message from './message.model';

// Send message
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = req.body;
  try {
    const newMessage = await sendMessageDB(message);
    sendResponse<MessageType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: newMessage,
      meta: null,
      message: 'Message sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get messages
export const getMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId } = req.query;
  try {
    const count = await Message.where('conversationId')
      .equals(conversationId)
      .countDocuments({});
    const messages = await getMessagesDB(conversationId as string);
    sendResponse<MessageType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: messages,
      meta: null,
      message: 'Messages retrieved successfully',
      count: count,
    });
  } catch (error) {
    next(error);
  }
};

// Get more messages
export const getMoreMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { conversationId, limit, skip } = req.query;
  try {
    const messages = await getMoreMessagesDB(
      conversationId as string,
      parseInt(limit as string) || 10,
      parseInt(skip as string) || 10
    );
    sendResponse<MessageType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: messages,
      meta: null,
      message: 'Messages retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete message
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedMessage = await deleteMessageDB(id);
    sendResponse<{ deletedMessage: string | undefined }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: { deletedMessage },
      meta: null,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Delete message
export const deleteAllMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const deletedMessage = await deleteAllMessageDB(id);
    sendResponse<unknown>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: deletedMessage,
      meta: null,
      message: 'All Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
