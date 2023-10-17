import { GenericErrorMessageType } from './error';

export type GenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: GenericErrorMessageType[];
};

export type GenericResponseType<T> = {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};
