import { Response } from 'express';

export type ApiResponseType<T> = {
  statusCode: number;
  success: boolean;
  message?: string | null;
  count?: number | null;
  meta?: {
    page: number;
    limit: number;
    total: number;
  } | null;
  data?: T | null;
};

export const sendResponse = <T>(
  res: Response,
  data: ApiResponseType<T>
): void => {
  const responseData: ApiResponseType<T> = {
    statusCode: data.statusCode,
    success: data.success,
    message: data.message,
    meta: data.meta || null,
    data: data.data || null,
    count: data.count || null,
  };
  res.status(data.statusCode).json(responseData);
};
