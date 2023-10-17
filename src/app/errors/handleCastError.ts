import mongoose from 'mongoose';
import { GenericErrorMessageType } from '../../interfaces/error';

export const handleCastError = (error: mongoose.Error.CastError) => {
  const statusCode = 401;
  const errorMessages: GenericErrorMessageType[] = [
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
