import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: UserPayload;
}

export interface UserPayload  {
    userId: Number,
};