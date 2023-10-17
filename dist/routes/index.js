"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversation_route_1 = __importDefault(require("../app/modules/conversation/conversation.route"));
const user_route_1 = __importDefault(require("../app/modules/user/user.route"));
const message_route_1 = __importDefault(require("../app/modules/message/message.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/conversations',
        route: conversation_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/messages',
        route: message_route_1.default,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
