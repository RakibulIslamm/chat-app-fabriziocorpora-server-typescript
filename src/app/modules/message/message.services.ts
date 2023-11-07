import { MessageType } from './message.interface';
import Message from './message.model';
import global from '../../../server';
import Conversation from '../conversation/conversation.model';
import ApiError from '../../errors/ApiError';
import httpStatus from 'http-status';

//* Send message
export const sendMessageDB = async (
  message: Partial<MessageType>
): Promise<MessageType> => {
  // const conversation = await Conversation.findById(message.conversationId);
  const newMessage = await Message.create({ ...message, status: 'sent' });
  /* if (!conversation?.isGroup) {
    const participant = conversation?.participants.find(
      id => id.toString() !== message?.sender?.id?.toString()
    );
    const socket = findSocketByUserId(participant?.toString());
    // console.log(socket);
    if (socket) {
      socket.emit('message', newMessage);
    }
  } else if (conversation?.isGroup) {
    global.io.in(conversation._id.toString()).emit('message', newMessage);
  } */
  global.io.emit('message', newMessage);
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
  limit = 16,
  skip: number
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

//* Delete all messages
export const deleteAllMessageDB = async (id: string) => {
  // const idObj = new mongoose.Types.ObjectId(id);
  const result = await Message.deleteMany({ conversationId: id });
  global.io.emit('delete-all-messages', id);
  return result;
};
