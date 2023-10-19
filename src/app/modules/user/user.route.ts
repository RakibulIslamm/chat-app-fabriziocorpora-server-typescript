import { Router } from 'express';
import {
  editUser,
  getMembers,
  getSingleUser,
  getUsers,
  login,
  registerUser,
} from './user.controller';

const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', login);
userRouter.get('/', getUsers);
userRouter.get('/select-members', getMembers);
userRouter.get('/user', getSingleUser);
userRouter.put('/edit', editUser);

export default userRouter;
