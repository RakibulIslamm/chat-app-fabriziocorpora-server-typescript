import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';
import { ConversationType } from './conversation.interface';
import {
  createConversationDB,
  deleteConversationDB,
  getConversationsDB,
  getMoreConversationsDB,
  getSearchChatDB,
  getSearchGroupDB,
  getSingleConversationDB,
  joinGroupDB,
  updateConversationsDB,
} from './conversation.services';
import { NextFunction, Request, Response } from 'express';
import Conversation from './conversation.model';

// Create conversation
export const createConversation = async (req: Request, res: Response) => {
  const data = req.body;
  const conversation = await createConversationDB(data);

  sendResponse<ConversationType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: conversation,
    meta: null,
    message: 'Conversation created successfully',
  });
};

// Update
export const updateConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const conversation = await updateConversationsDB(id, data);
    sendResponse<ConversationType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversation,
      meta: null,
      message: 'Conversation updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Join group
export const joinGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.query;
    const { userId } = req.body;
    const conversation = await joinGroupDB(id as string, userId as string);
    sendResponse<ConversationType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversation,
      meta: null,
      message: 'Group joined successfully',
    });
  } catch (error) {
    next(error);
  }
};

// delete conversation
export const deleteConversation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedConversation = await deleteConversationDB(id);

  sendResponse<{ deletedConversation: string | undefined }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: { deletedConversation },
    meta: null,
    message: 'Conversation deleted successfully',
  });
};

// Get conversations
export const getConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.query.id;
  try {
    const count = await Conversation.where('participants')
      .in([userId])
      .countDocuments({});

    const conversations = await getConversationsDB(userId as string);
    sendResponse<ConversationType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversations,
      meta: null,
      message: 'Conversations retrieved successfully',
      count: count,
    });
  } catch (error) {
    next(error);
  }
};

// Get more conversations
export const getMoreConversations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, limit, skip } = req.query;
  try {
    const conversations = await getMoreConversationsDB(
      id as string,
      parseInt(limit as string) || 16,
      parseInt(skip as string) || 0
    );
    sendResponse<ConversationType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversations,
      meta: null,
      message: 'Conversations retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get single conversation
export const getSingleConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const conversationId = req.params.id;
  try {
    const conversations = await getSingleConversationDB(
      conversationId as string
    );
    sendResponse<ConversationType>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversations,
      meta: null,
      message: 'Conversation retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get searched chat
export const searchChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, search } = req.query;

  try {
    if (!search) {
      sendResponse<ConversationType[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: [],
        meta: null,
        message: 'Conversation retrieved successfully',
      });
      return;
    }

    const conversations = await getSearchChatDB(search as string, id as string);
    sendResponse<ConversationType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversations,
      meta: null,
      message: 'Conversation retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get search group
export const searchGroup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { search } = req.query;

  try {
    if (!search) {
      sendResponse<ConversationType[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        data: [],
        meta: null,
        message: 'Group retrieved successfully',
      });
      return;
    }

    const conversations = await getSearchGroupDB(search as string);
    sendResponse<ConversationType[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: conversations,
      meta: null,
      message: 'Conversation retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};
