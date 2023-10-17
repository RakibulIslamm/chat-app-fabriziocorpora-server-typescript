import { Error } from 'mongoose';
import { GenericErrorResponse } from '../../interfaces/common';
import { GenericErrorMessageType } from '../../interfaces/error';

export const handleValidationError = (
  error: Error.ValidationError
): GenericErrorResponse => {
  const errors: GenericErrorMessageType[] = Object.values(error.errors).map(
    elem => {
      return {
        path: elem?.path,
        message: elem.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode: statusCode,
    errorMessages: errors,
    message: 'Validation Error',
  };
};
