"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
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
