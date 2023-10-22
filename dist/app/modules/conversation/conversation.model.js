"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    isGroup: { type: Boolean, default: false },
    groupName: { type: String },
    groupCreator: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    groupColor: { type: String },
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    sender: {
        type: String,
    },
    lastMessage: { type: String },
    img: { type: Boolean },
    timestamp: { type: Number },
    unseenMessages: { type: Number, default: 0 },
});
const Conversation = (0, mongoose_1.model)('Conversation', ConversationSchema);
exports.default = Conversation;
