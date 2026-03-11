import { AppError } from './AppError';

export class AuthenticationError extends AppError {
  constructor(message: string, trace?: Error) {
    super(401, message, trace);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string, trace?: Error) {
    super(403, message, trace);
  }
}
