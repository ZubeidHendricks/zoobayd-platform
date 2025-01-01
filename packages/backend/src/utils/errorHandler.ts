import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_ERROR';

  logger.error('Error occurred', {
    error: {
      message: err.message,
      code: errorCode,
      stack: err.stack
    },
    request: {
      method: req.method,
      url: req.url,
      userId: req.user?.id,
      teamId: req.user?.teamId
    }
  });

  res.status(statusCode).json({
    error: {
      message: err.message,
      code: errorCode
    }
  });
};