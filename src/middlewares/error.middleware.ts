import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/note';

/**
 * Centralized async error handler wrapper
 * 
 * WHY THIS IS IMPORTANT:
 * - Eliminates try-catch blocks in every controller
 * - Automatically catches async errors and passes to error middleware
 * - Makes controllers cleaner and more readable
 * 
 * HOW IT WORKS:
 * 1. Wraps async controller function
 * 2. Catches any promise rejection
 * 3. Forwards error to next() -> error middleware
 * 
 * EXAMPLE:
 * Instead of:
 *   async (req, res) => { try { ... } catch(e) { next(e) } }
 * 
 * We use:
 *   asyncHandler(async (req, res) => { ... })
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Global error handling middleware
 * 
 * WHY CENTRALIZED ERROR HANDLING:
 * 1. Consistent error format across all endpoints
 * 2. Single place to modify error responses
 * 3. Easier to add logging, monitoring, alerts
 * 4. Controllers stay clean - just throw errors
 * 5. Scalable - works for 1 endpoint or 100
 * 
 * ERROR TYPES HANDLED:
 * - AppError: Operational errors (404, 400, etc.)
 * - Unexpected errors: 500 Internal Server Error
 * 
 * UNDER LOAD (1000+ users):
 * - This middleware remains efficient
 * - No performance bottleneck
 * - Logging could be moved to async queue for very high load
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging (in production, use proper logging service)
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Determine if error is operational (expected) or programming error
  if (err instanceof AppError) {
    // Operational error - safe to send to client
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode
    });
    return;
  }

  // Programming error or unknown error - don't leak details
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    statusCode: 500
  });
};

/**
 * 404 Not Found handler for undefined routes
 * This should be registered AFTER all valid routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    404,
    `Route ${req.method} ${req.originalUrl} not found`
  );
  next(error);
};