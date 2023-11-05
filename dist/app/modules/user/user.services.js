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
exports.editUserDB = exports.getMembersDB = exports.getSingleUserDB = exports.getUsersDB = exports.loginDB = exports.registerUserDB = void 0;
const conversation_model_1 = __importDefault(require("../conversation/conversation.model"));
const user_model_1 = __importDefault(require("./user.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
//* Register
const registerUserDB = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield user_model_1.default.findOne({
        username: user.username,
    });
    if (isExist) {
        throw new ApiError_1.default(401, `'${user.username}' username already exist`);
    }
    if (!user.username) {
        throw new Error(`Username required`);
    }
    const result = user_model_1.default.create(user);
    return result;
});
exports.registerUserDB = registerUserDB;
//* Login
const loginDB = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ username: username });
    if (!user) {
        throw new ApiError_1.default(404, `Username of this '${username}' user is not exist`);
    }
    return user;
});
exports.loginDB = loginDB;
//* Get remaining users, who are not in my conversation
const getUsersDB = (query, id) => __awaiter(void 0, void 0, void 0, function* () {
    const addedUsers = (yield conversation_model_1.default.where('participants')
        .in([id])
        .where('isGroup')
        .equals(false)).map(conversation => conversation.participants.filter(userId => userId.toString() !== id.toString())[0]);
    const users = yield user_model_1.default.find({
        $and: [
            {
                _id: { $nin: [...addedUsers, id] },
            },
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                ],
            },
        ],
    }).exec();
    return users;
});
exports.getUsersDB = getUsersDB;
//* Get single user
const getSingleUserDB = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ username: username });
    if (!user) {
        throw new ApiError_1.default(404, `Username of this '${username}' user is not exist`);
    }
    return user;
});
exports.getSingleUserDB = getSingleUserDB;
//* Get users for join group
const getMembersDB = (query, currentUserId, addedUsers) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.default.find({
        $and: [
            {
                _id: { $nin: [currentUserId, ...addedUsers] },
            },
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { username: { $regex: query, $options: 'i' } },
                ],
            },
        ],
    });
    return users;
});
exports.getMembersDB = getMembersDB;
//* Edit user
const editUserDB = (userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.default(404, `User not found`);
    }
    const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, Object.assign({}, data), { new: true });
    return updatedUser;
});
exports.editUserDB = editUserDB;
