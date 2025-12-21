import { Request, Response, NextFunction } from 'express'
import { AppError } from '../types/note'

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode
    })
    return
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    statusCode: 500
  })
}

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    404,
    `Route ${req.method} ${req.originalUrl} not found`
  )
  next(error)
}