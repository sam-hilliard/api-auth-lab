import { AppError } from './AppError';

export class ClientError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}
