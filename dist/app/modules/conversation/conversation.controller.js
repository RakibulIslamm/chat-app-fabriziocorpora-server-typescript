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
exports.searchGroup = exports.searchChat = exports.getSingleConversation = exports.getMoreConversations = exports.getConversations = exports.deleteConversation = exports.joinGroup = exports.updateConversation = exports.createConversation = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const conversation_services_1 = require("./conversation.services");
const conversation_model_1 = __importDefault(require("./conversation.model"));
// Create conversation
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const conversation = yield (0, conversation_services_1.createConversationDB)(data);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: conversation,
        meta: null,
        message: 'Conversation created successfully',
    });
});
exports.createConversation = createConversation;
// Update
const updateConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const conversation = yield (0, conversation_services_1.updateConversationsDB)(id, data);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversation,
            meta: null,
            message: 'Conversation updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.updateConversation = updateConversation;
// Join group
const joinGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { userId } = req.body;
        const conversation = yield (0, conversation_services_1.joinGroupDB)(id, userId);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversation,
            meta: null,
            message: 'Group joined successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.joinGroup = joinGroup;
// delete conversation
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deletedConversation = yield (0, conversation_services_1.deleteConversationDB)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        data: { deletedConversation },
        meta: null,
        message: 'Conversation created successfully',
    });
});
exports.deleteConversation = deleteConversation;
// Get conversations
const getConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.query.id;
    try {
        const count = yield conversation_model_1.default.where('participants')
            .in([userId])
            .countDocuments({});
        const conversations = yield (0, conversation_services_1.getConversationsDB)(userId);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversations,
            meta: null,
            message: 'Conversation created successfully',
            count: count,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getConversations = getConversations;
// Get more conversations
const getMoreConversations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, limit, skip } = req.query;
    try {
        const conversations = yield (0, conversation_services_1.getMoreConversationsDB)(id, parseInt(limit) || 16, parseInt(skip) || 0);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversations,
            meta: null,
            message: 'Conversation created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getMoreConversations = getMoreConversations;
// Get single conversation
const getSingleConversation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conversationId = req.params.id;
    try {
        const conversations = yield (0, conversation_services_1.getSingleConversationDB)(conversationId);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversations,
            meta: null,
            message: 'Conversation created successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getSingleConversation = getSingleConversation;
// Get searched chat
const searchChat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, search } = req.query;
    try {
        if (!search) {
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                data: [],
                meta: null,
                message: 'Conversation retrieved successfully',
            });
            return;
        }
        const conversations = yield (0, conversation_services_1.getSearchChatDB)(search, id);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversations,
            meta: null,
            message: 'Conversation retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchChat = searchChat;
// Get search group
const searchGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { search } = req.query;
    try {
        if (!search) {
            (0, sendResponse_1.sendResponse)(res, {
                statusCode: http_status_1.default.OK,
                success: true,
                data: [],
                meta: null,
                message: 'Group retrieved successfully',
            });
            return;
        }
        const conversations = yield (0, conversation_services_1.getSearchGroupDB)(search);
        (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            data: conversations,
            meta: null,
            message: 'Conversation retrieved successfully',
        });
    }
    catch (error) {
        next(error);
    }
});
exports.searchGroup = searchGroup;
