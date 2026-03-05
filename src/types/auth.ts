import { Request } from 'express';

export interface AuthRequest extends Request {
  user: UserPayload;
}

export interface UserPayload {
  id: number;
  username: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
}
