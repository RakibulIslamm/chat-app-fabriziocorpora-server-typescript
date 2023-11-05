"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const routes_1 = __importDefault(require("../routes"));
const globalErrorHandler_1 = require("./middlewares/globalErrorHandler");
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/uploads', express_1.default.static('uploads'));
process.on('uncaughtException', error => {
    console.log(error);
    process.exit(1);
});
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('Hello From Server');
});
// File upload
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Store files in the "uploads" folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res, next) => {
    var _a;
    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${(_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename}`;
        res.json({ fileUrl });
    }
    catch (err) {
        next(err);
    }
});
// Handle not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'Not found',
        errorMessages: [{ path: req.originalUrl, message: 'Api not found' }],
    });
    next();
});
app.use(globalErrorHandler_1.globalErrorHandler);
exports.default = app;
