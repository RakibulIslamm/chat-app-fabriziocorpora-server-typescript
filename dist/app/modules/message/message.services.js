"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteAllMessageDB = exports.deleteMessageDB = exports.getMoreMessagesDB = exports.getMessagesDB = exports.sendMessageDB = void 0;
const message_model_1 = __importDefault(require("./message.model"));
const server_1 = __importStar(require("../../../server"));
const conversation_model_1 = __importDefault(require("../conversation/conversation.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
//* Send message
const sendMessageDB = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_model_1.default.findById(message.conversationId);
    const newMessage = yield message_model_1.default.create(Object.assign(Object.assign({}, message), { status: 'sent' }));
    if (!(conversation === null || conversation === void 0 ? void 0 : conversation.isGroup)) {
        const participant = conversation === null || conversation === void 0 ? void 0 : conversation.participants.find(id => { var _a, _b; return id.toString() !== ((_b = (_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.toString()); });
        const socket = (0, server_1.findSocketByUserId)(participant === null || participant === void 0 ? void 0 : participant.toString());
        // console.log(socket);
        if (socket) {
            socket.emit('message', newMessage);
        }
    }
    else if (conversation === null || conversation === void 0 ? void 0 : conversation.isGroup) {
        server_1.default.io.in(conversation._id.toString()).emit('message', newMessage);
    }
    return newMessage;
});
exports.sendMessageDB = sendMessageDB;
//* Get messages
const getMessagesDB = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield conversation_model_1.default.findById(conversationId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation not found');
    }
    const messages = yield message_model_1.default.where('conversationId')
        .equals(conversationId)
        .sort({ timestamp: -1 })
        .skip(0)
        .limit(16);
    return messages;
});
exports.getMessagesDB = getMessagesDB;
//* Get more messages
const getMoreMessagesDB = (conversationId, limit = 16, skip) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield conversation_model_1.default.findById(conversationId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation not found');
    }
    const messages = yield message_model_1.default.where('conversationId')
        .equals(conversationId)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    return messages;
});
exports.getMoreMessagesDB = getMoreMessagesDB;
//* Delete message
const deleteMessageDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMessage = yield message_model_1.default.findByIdAndRemove(id);
    server_1.default.io.emit('delete-message', deletedMessage);
    return deletedMessage === null || deletedMessage === void 0 ? void 0 : deletedMessage._id;
});
exports.deleteMessageDB = deleteMessageDB;
//* Delete all messages
const deleteAllMessageDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const idObj = new mongoose.Types.ObjectId(id);
    const result = yield message_model_1.default.deleteMany({ conversationId: id });
    server_1.default.io.emit('delete-all-messages', id);
    return result;
});
exports.deleteAllMessageDB = deleteAllMessageDB;
