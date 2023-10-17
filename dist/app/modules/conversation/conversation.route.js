"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_controller_1 = require("./conversation.controller");
const conversationRouter = (0, express_1.Router)();
conversationRouter.post('/', conversation_controller_1.createConversation);
conversationRouter.put('/join-group', conversation_controller_1.joinGroup);
conversationRouter.get('/', conversation_controller_1.getConversations);
conversationRouter.get('/more-conversations', conversation_controller_1.getMoreConversations);
conversationRouter.get('/search-chat', conversation_controller_1.searchChat);
conversationRouter.get('/search-group', conversation_controller_1.searchGroup);
conversationRouter.put('/:id', conversation_controller_1.updateConversation);
conversationRouter.get('/conversation/:id', conversation_controller_1.getSingleConversation);
conversationRouter.delete('/delete-conversation/:id', conversation_controller_1.deleteConversation);
exports.default = conversationRouter;
