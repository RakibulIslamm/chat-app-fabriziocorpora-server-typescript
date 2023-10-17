"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const config_1 = __importDefault(require("../../config"));
const handleValidationError_1 = require("../errors/handleValidationError");
const handleCastError_1 = require("../errors/handleCastError");
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const globalErrorHandler = (error, req, res, next) => {
    // Logger is not save when application is running development mode
    config_1.default.env === 'development'
        ? console.log('Global Error Handler: ', error)
        : console.log(error);
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errorMessages = [];
    if (error.name === 'ValidationError') {
        const simplifiedError = (0, handleValidationError_1.handleValidationError)(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    }
    else if (error.name === 'CastError') {
        const simplifiedZodError = (0, handleCastError_1.handleCastError)(error);
        statusCode = simplifiedZodError.statusCode;
        message = simplifiedZodError.message;
        errorMessages = simplifiedZodError.errorMessages;
    }
    else if (error instanceof ApiError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [{ path: '', message: error === null || error === void 0 ? void 0 : error.message }]
            : [];
    }
    else if (error instanceof Error) {
        message = error.message;
        errorMessages = (error === null || error === void 0 ? void 0 : error.message)
            ? [{ path: '', message: error.message }]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env === 'development' ? error.stack : '',
    });
    next();
};
exports.globalErrorHandler = globalErrorHandler;
