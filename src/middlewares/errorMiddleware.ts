import { ErrorRequestHandler } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler: ErrorRequestHandler = async (err, _req, res, _next) => {
  console.log(err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};
