import { AppError } from './AppError';

export class AuthError extends AppError {
  constructor(message: string, trace?: Error) {
    super(401, message, trace);
  }
}