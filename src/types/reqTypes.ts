import { Request } from 'express';
import { User } from './userTypes';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export type AuthHandler = (req: AuthenticatedRequest, res: Response) => Promise<void>;
