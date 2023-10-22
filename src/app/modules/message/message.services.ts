import { MessageType } from './message.interface';
import Message from './message.model';
import global, { findSocketByUserId } from '../../../server';
import Conversation from '../conversation/conversation.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

//* Send message
export const sendMessageDB = async (
  message: Partial<MessageType>
): Promise<MessageType> => {
  // const newMessage = await Message.create(message);
  const newMessage = new Message(message);
  // const socket = findSocketByUserId('652a52b47a16a06cdbdafc4f');
  // console.log(socket);
  global.io.emit('message', newMessage);
  await newMessage.save();
  return newMessage;
};

//* Get messages
export const getMessagesDB = async (
  conversationId: string
): Promise<MessageType[]> => {
  const isExist = await Conversation.findById(conversationId);
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }
  const messages = await Message.where('conversationId')
    .equals(conversationId)
    .sort({ timestamp: -1 })
    .skip(0)
    .limit(16);
  return messages;
};

//* Get more messages
export const getMoreMessagesDB = async (
  conversationId: string,
  limit = 10,
  skip = 0
): Promise<MessageType[]> => {
  const isExist = await Conversation.findById(conversationId);
  if (!isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }
  const messages = await Message.where('conversationId')
    .equals(conversationId)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit);
  return messages;
};

//* Delete message
export const deleteMessageDB = async (
  id: string
): Promise<string | undefined> => {
  const deletedMessage = await Message.findByIdAndRemove(id);
  global.io.emit('delete-message', deletedMessage);
  return deletedMessage?._id;
};
