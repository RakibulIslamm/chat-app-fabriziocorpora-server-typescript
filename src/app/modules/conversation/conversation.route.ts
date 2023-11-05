import { Router } from 'express';
import {
  addGroupMembers,
  createConversation,
  deleteConversation,
  getConversations,
  getMoreConversations,
  getSingleConversation,
  joinGroup,
  searchChat,
  searchGroup,
  updateConversation,
} from './conversation.controller';

const conversationRouter = Router();

conversationRouter.post('/', createConversation);
conversationRouter.put('/join-group', joinGroup);
conversationRouter.put('/add-members', addGroupMembers);
conversationRouter.get('/', getConversations);
conversationRouter.get('/more-conversations', getMoreConversations);
conversationRouter.get('/search-chat', searchChat);
conversationRouter.get('/search-group', searchGroup);
conversationRouter.put('/:id', updateConversation);
conversationRouter.get('/conversation/:id', getSingleConversation);
conversationRouter.delete('/delete-conversation/:id', deleteConversation);

export default conversationRouter;
