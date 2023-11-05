import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import router from '../routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import multer from 'multer';
import path from 'path';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Server');
});

const uploadDirectory = path.join(process.cwd(), 'uploads');
console.log('Upload dir', uploadDirectory);

// File upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Store files in the "uploads" folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res, next) => {
  try {
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${
      req?.file?.filename
    }`;
    res.json({ fileUrl });
  } catch (err) {
    next(err);
  }
});

// Handle not found route
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [{ path: req.originalUrl, message: 'Api not found' }],
  });
  next();
});

app.use(globalErrorHandler);

export default app;
