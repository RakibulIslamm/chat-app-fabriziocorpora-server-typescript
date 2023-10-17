"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationError = void 0;
const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map(elem => {
        return {
            path: elem === null || elem === void 0 ? void 0 : elem.path,
            message: elem.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode: statusCode,
        errorMessages: errors,
        message: 'Validation Error',
    };
};
exports.handleValidationError = handleValidationError;
