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
exports.deleteAllMessage = exports.deleteMessage = exports.getMoreMessages = exports.getMessages = exports.sendMessage = void 0;
const message_services_1 = require("./message.services");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const message_model_1 = __importDefault(require("./message.model"));
// Send message
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const message = req.body;
    try {
        const newMessage = yield (0, message_services_1.sendMessageDB)(message);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: newMessage,
            meta: null,
            message: 'Message sent successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.sendMessage = sendMessage;
// Get messages
const getMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.query;
    try {
        const count = yield message_model_1.default.where('conversationId')
            .equals(conversationId)
            .countDocuments({});
        const messages = yield (0, message_services_1.getMessagesDB)(conversationId);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: messages,
            meta: null,
            message: 'Messages retrieved successfully',
            count: count,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMessages = getMessages;
// Get more messages
const getMoreMessages = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId, limit, skip } = req.query;
    try {
        const messages = yield (0, message_services_1.getMoreMessagesDB)(conversationId, parseInt(limit) || 10, parseInt(skip) || 10);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: messages,
            meta: null,
            message: 'Messages retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMoreMessages = getMoreMessages;
// Delete message
const deleteMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedMessage = yield (0, message_services_1.deleteMessageDB)(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: { deletedMessage },
            meta: null,
            message: 'Message deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteMessage = deleteMessage;
// Delete message
const deleteAllMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedMessage = yield (0, message_services_1.deleteAllMessageDB)(id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: deletedMessage,
            meta: null,
            message: 'All Message deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteAllMessage = deleteAllMessage;
