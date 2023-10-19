"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const userRouter = (0, express_1.Router)();
userRouter.post('/register', user_controller_1.registerUser);
userRouter.post('/login', user_controller_1.login);
userRouter.get('/', user_controller_1.getUsers);
userRouter.get('/select-members', user_controller_1.getMembers);
userRouter.get('/user', user_controller_1.getSingleUser);
userRouter.put('/edit', user_controller_1.editUser);
exports.default = userRouter;
