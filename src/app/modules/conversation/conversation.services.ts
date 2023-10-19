import httpStatus from 'http-status';
import { ConversationType } from './conversation.interface';
import Conversation from './conversation.model';
import global from '../../../server';
import User from '../user/user.model';
import ApiError from '../../errors/ApiError';
import Message from '../message/message.model';

//* Create conversation
export const createConversationDB = async (
  data: ConversationType
): Promise<ConversationType> => {
  const newConversation = await Conversation.create(data);
  await newConversation.populate('participants');
  global.io.emit('conversation', newConversation);
  return newConversation;
};

//* Update conversation
export const updateConversationsDB = async (
  conversationId: string,
  data: Partial<ConversationType>
): Promise<ConversationType | null> => {
  if (!conversationId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation id required');
  }
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation Not found');
  }

  const unseenCount =
    conversation?.sender?.toString() !== data?.sender?.toString()
      ? 1
      : conversation.unseenMessages + 1;

  const updatedDoc = {
    ...data,
    unseenMessages: unseenCount,
  };
  global.io.emit('update-conversation', {
    data: { ...data, unseenMessages: unseenCount },
    id: conversationId,
  });
  const updatedConversation = await Conversation.findByIdAndUpdate(
    conversationId,
    updatedDoc,
    { new: true }
  );
  return updatedConversation;
};

//* Join group conversation
export const joinGroupDB = async (
  conversationId: string,
  userId: string
): Promise<ConversationType | null> => {
  const conversation = await Conversation.findById(conversationId);

  if (conversation) {
    if (
      conversation.participants.some(
        participant => participant.toString() === userId.toString()
      )
    ) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Already added');
    }
    const joinedConversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { $push: { participants: userId } },
      { new: true }
    ).populate('participants');
    global.io.emit('join-group', {
      updatedConversation: joinedConversation,
      id: conversationId,
    });

    return joinedConversation;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }
};

//* Delete conversation
export const deleteConversationDB = async (
  id: string
): Promise<string | undefined> => {
  const conversation = await Conversation.findById(id);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  await Message.deleteMany({ conversationId: id });
  const deletedConversation = await Conversation.findByIdAndRemove(id);
  global.io.emit('delete-conversation', id);
  return deletedConversation?._id.toString();
};

//* Get conversations
export const getConversationsDB = async (
  userId: string
): Promise<ConversationType[]> => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User id required');
  }

  const isExist = await User.findById(userId);
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not found');
  }

  const conversations = await Conversation.where('participants')
    .in([userId])
    .sort({ timestamp: -1 })
    .limit(16)
    .populate('participants');
  return conversations;
};

//* Get more conversations
export const getMoreConversationsDB = async (
  userId: string,
  limit = 16,
  skip = 0
): Promise<ConversationType[]> => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User id required');
  }
  const isExist = await User.findById(userId);
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not found');
  }
  const conversations = await Conversation.where('participants')
    .in([userId])
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .populate('participants');
  return conversations;
};

//* Get single conversation
export const getSingleConversationDB = async (
  conversationId: string
): Promise<ConversationType> => {
  if (!conversationId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation id required');
  }
  const conversation = await Conversation.findById(conversationId).populate(
    'participants'
  );
  if (!conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }
  return conversation;
};

//* Get search chat
export const getSearchChatDB = async (
  searchText: string,
  id: string
): Promise<ConversationType[]> => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User id required');
  }

  const conversations = await Conversation.find({
    participants: id,
    isGroup: false,
  })
    .populate({
      path: 'participants',
      model: 'User',
    })
    .sort({ timestamp: -1 })
    .exec();

  const filtered = conversations.filter(conversation =>
    conversation.participants.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user: any) =>
        user.name && user.name.toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return filtered;
};

//* Get search group
export const getSearchGroupDB = async (
  searchText: string
): Promise<ConversationType[]> => {
  const conversations = await Conversation.find({
    $and: [
      {
        isGroup: true,
      },
      {
        $or: [{ groupName: { $regex: searchText, $options: 'i' } }],
      },
    ],
  })
    .sort({ timestamp: -1 })
    .populate('participants');
  return conversations;
};
