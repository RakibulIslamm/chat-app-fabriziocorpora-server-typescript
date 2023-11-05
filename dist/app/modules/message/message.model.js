"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    messageId: { type: String, required: true },
    sender: {
        name: { type: String },
        id: { type: mongoose_1.Schema.Types.ObjectId },
    },
    conversationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Conversation',
    },
    message: { type: String },
    img: { type: String },
    file: {
        name: { type: String },
        type: { type: String },
        link: { type: String },
    },
    forGroup: { type: Boolean, default: false },
    newGroup: {
        groupCreator: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        addedMembers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    },
    addMembers: {
        addedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
        addedMembers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    },
    joinGroup: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Number },
    replyTo: {
        _id: String,
        message: String,
        img: String,
    },
    status: { type: String },
    seen: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});
const Message = (0, mongoose_1.model)('Message', MessageSchema);
exports.default = Message;
