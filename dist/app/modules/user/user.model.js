"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String },
    img: { type: String },
    bio: { type: String },
    color: { type: String },
    status: { type: String, default: 'online' },
    lastActive: { type: Number || null },
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.default = User;
