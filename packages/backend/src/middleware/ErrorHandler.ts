import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/Logger';

class ErrorHandler {
  // Central error handling middleware
  public static handleError(
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    // Log the error
    Logger.error('Unhandled Error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });

    // Determine error type and response
    if (err instanceof ValidationError) {
      return res.status(400).json({
        status: 'error',
        type: 'validation',
        message: err.message
      });
    }

    if (err instanceof AuthenticationError) {
      return res.status(401).json({
        status: 'error',
        type: 'authentication',
        message: err.message
      });
    }

    // Generic server error for unhandled exceptions
    res.status(500).json({
      status: 'error',
      type: 'server',
      message: 'An unexpected error occurred'
    });
  }

  // Method to wrap async route handlers and catch errors
  public static asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

// Custom Error Classes
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export { 
  ErrorHandler, 
  ValidationError, 
  AuthenticationError 
};