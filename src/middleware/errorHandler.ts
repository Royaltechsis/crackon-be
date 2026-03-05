import { Request, Response, NextFunction } from 'express';

// Error handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err.stack);
  
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

// 404 Not Found middleware
export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
};
