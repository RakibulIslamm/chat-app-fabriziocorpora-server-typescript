import { Router } from 'express';
import conversationRouter from '../app/modules/conversation/conversation.route';
import userRouter from '../app/modules/user/user.route';
import messageRouter from '../app/modules/message/message.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/conversations',
    route: conversationRouter,
  },
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/messages',
    route: messageRouter,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
