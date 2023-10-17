import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import router from '../routes';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on('uncaughtException', error => {
  console.log(error);
  process.exit(1);
});

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello From Server');
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
