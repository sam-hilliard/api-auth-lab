import { AppError } from './AppError';

export class AuthError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}
