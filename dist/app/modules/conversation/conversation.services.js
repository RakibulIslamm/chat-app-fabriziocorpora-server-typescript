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
exports.getSearchGroupDB = exports.getSearchChatDB = exports.getSingleConversationDB = exports.getMoreConversationsDB = exports.getConversationsDB = exports.deleteConversationDB = exports.joinGroupDB = exports.updateConversationsDB = exports.createConversationDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const conversation_model_1 = __importDefault(require("./conversation.model"));
const server_1 = __importDefault(require("../../../server"));
const user_model_1 = __importDefault(require("../user/user.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const message_model_1 = __importDefault(require("../message/message.model"));
//* Create conversation
const createConversationDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newConversation = yield conversation_model_1.default.create(data);
    yield newConversation.populate('participants');
    yield newConversation.populate('sender');
    server_1.default.io.emit('conversation', newConversation);
    return newConversation;
});
exports.createConversationDB = createConversationDB;
//* Update conversation
const updateConversationsDB = (conversationId, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!conversationId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation id required');
    }
    const conversation = yield conversation_model_1.default.findById(conversationId);
    if (!conversation) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation Not found');
    }
    const unseenCount = conversation.sender !== data.sender ? 1 : conversation.unseenMessages + 1;
    const updatedDoc = Object.assign(Object.assign({}, data), { unseenMessages: unseenCount });
    server_1.default.io.emit('update-conversation', {
        data: Object.assign({}, data),
        id: conversationId,
    });
    const updatedConversation = yield conversation_model_1.default.findByIdAndUpdate(conversationId, updatedDoc, { new: true });
    return updatedConversation;
});
exports.updateConversationsDB = updateConversationsDB;
//* Join group conversation
const joinGroupDB = (conversationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_model_1.default.findById(conversationId);
    if (conversation) {
        if (conversation.participants.some(participant => participant.toString() === userId.toString())) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Already added');
        }
        const joinedConversation = yield conversation_model_1.default.findByIdAndUpdate(conversationId, { $push: { participants: userId } }, { new: true }).populate('participants');
        server_1.default.io.emit('join-group', {
            updatedConversation: joinedConversation,
            id: conversationId,
        });
        return joinedConversation;
    }
    else {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation not found');
    }
});
exports.joinGroupDB = joinGroupDB;
//* Delete conversation
const deleteConversationDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const conversation = yield conversation_model_1.default.findById(id);
    if (!conversation) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Conversation not found');
    }
    yield message_model_1.default.deleteMany({ conversationId: id });
    const deletedConversation = yield conversation_model_1.default.findByIdAndRemove(id);
    server_1.default.io.emit('delete-conversation', id);
    return deletedConversation === null || deletedConversation === void 0 ? void 0 : deletedConversation._id.toString();
});
exports.deleteConversationDB = deleteConversationDB;
//* Get conversations
const getConversationsDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User id required');
    }
    const isExist = yield user_model_1.default.findById(userId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not found');
    }
    const conversations = yield conversation_model_1.default.where('participants')
        .in([userId])
        .sort({ timestamp: -1 })
        .limit(16)
        .populate('participants')
        .populate('sender');
    return conversations;
});
exports.getConversationsDB = getConversationsDB;
//* Get more conversations
const getMoreConversationsDB = (userId, limit = 16, skip = 0) => __awaiter(void 0, void 0, void 0, function* () {
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User id required');
    }
    const isExist = yield user_model_1.default.findById(userId);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Not found');
    }
    const conversations = yield conversation_model_1.default.where('participants')
        .in([userId])
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .populate('participants')
        .populate('sender');
    return conversations;
});
exports.getMoreConversationsDB = getMoreConversationsDB;
//* Get single conversation
const getSingleConversationDB = (conversationId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!conversationId) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation id required');
    }
    const conversation = yield conversation_model_1.default.findById(conversationId)
        .populate('participants')
        .populate('sender');
    if (!conversation) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Conversation not found');
    }
    return conversation;
});
exports.getSingleConversationDB = getSingleConversationDB;
//* Get search chat
const getSearchChatDB = (searchText, id) => __awaiter(void 0, void 0, void 0, function* () {
    if (!id) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User id required');
    }
    const conversations = yield conversation_model_1.default.find({
        participants: id,
        isGroup: false,
    })
        .populate({
        path: 'participants',
        model: 'User',
    })
        .sort({ timestamp: -1 })
        .exec();
    const filtered = conversations.filter(conversation => conversation.participants.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (user) => user.name && user.name.toLowerCase().includes(searchText.toLowerCase())));
    return filtered;
});
exports.getSearchChatDB = getSearchChatDB;
//* Get search group
const getSearchGroupDB = (searchText) => __awaiter(void 0, void 0, void 0, function* () {
    const conversations = yield conversation_model_1.default.find({
        $and: [
            {
                isGroup: true,
            },
            {
                $or: [{ groupName: { $regex: searchText, $options: 'i' } }],
            },
        ],
    })
        .sort({ timestamp: -1 })
        .populate('participants');
    return conversations;
});
exports.getSearchGroupDB = getSearchGroupDB;
