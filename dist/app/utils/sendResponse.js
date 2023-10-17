"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, data) => {
    const responseData = {
        statusCode: data.statusCode,
        success: data.success,
        message: data.message,
        meta: data.meta || null,
        data: data.data || null,
        count: data.count || null,
    };
    res.status(data.statusCode).json(responseData);
};
exports.sendResponse = sendResponse;
