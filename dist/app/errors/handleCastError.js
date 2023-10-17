"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCastError = void 0;
const handleCastError = (error) => {
    const statusCode = 401;
    const errorMessages = [
        {
            message: 'Invalid Id',
            path: error.path,
        },
    ];
    return {
        statusCode,
        message: 'Cast Error',
        errorMessages,
    };
};
exports.handleCastError = handleCastError;
