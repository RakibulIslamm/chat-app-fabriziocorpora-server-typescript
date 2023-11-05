import { Router } from 'express';
import {
  deleteAllMessage,
  deleteMessage,
  getMessages,
  getMoreMessages,
  sendMessage,
} from './message.controller';

const messageRouter = Router();

messageRouter.post('/send-message', sendMessage);
messageRouter.get('/', getMessages);
messageRouter.get('/more-messages', getMoreMessages);
messageRouter.delete('/delete-message/:id', deleteMessage);
messageRouter.delete('/delete-all-message/:id', deleteAllMessage);

export default messageRouter;
