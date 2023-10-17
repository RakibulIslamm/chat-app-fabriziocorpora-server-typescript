"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUser = exports.getSingleUser = exports.getMembers = exports.getUsers = exports.login = exports.registerUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_services_1 = require("./user.services");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const sendResponse_1 = require("../../utils/sendResponse");
// Register
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    try {
        const newUser = yield (0, user_services_1.registerUserDB)(user);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: newUser,
            meta: null,
            message: 'Registered successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.registerUser = registerUser;
// Login
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    try {
        const user = yield (0, user_services_1.loginDB)(username);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: user,
            meta: null,
            message: 'User retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
// Get remaining users, who are not in my conversation
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const currentUser = req.query.id;
    try {
        if (!currentUser) {
            throw new ApiError_1.default(400, 'User id not found');
        }
        const users = yield (0, user_services_1.getUsersDB)(query, currentUser);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: users,
            meta: null,
            message: 'Users retrieved successfully',
        });
    }
    catch (error) {
        next(next);
    }
});
exports.getUsers = getUsers;
// Get users for group invite
const getMembers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query.q;
    const currentUser = req.query.id;
    try {
        const users = yield (0, user_services_1.getMembersDB)(query, currentUser);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: users,
            meta: null,
            message: 'Users retrieved successfully',
        });
    }
    catch (error) {
        next(next);
    }
});
exports.getMembers = getMembers;
// Get single user
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.query.username;
    try {
        if (!username) {
            throw new ApiError_1.default(400, 'Username required');
        }
        const user = yield (0, user_services_1.getSingleUserDB)(username);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: user,
            meta: null,
            message: 'User retrieved successfully',
        });
    }
    catch (error) {
        next(next);
    }
});
exports.getSingleUser = getSingleUser;
// Edit user
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    const data = req.body;
    try {
        if (!userId) {
            throw new ApiError_1.default(400, 'User id required');
        }
        const user = yield (0, user_services_1.editUserDB)(userId, data);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: user,
            meta: null,
            message: 'User updated successfully',
        });
    }
    catch (error) {
        next(next);
    }
});
exports.editUser = editUser;
