import { Response, NextFunction } from 'express';
import { AuthRequest, UserPayload } from '../types/auth';
import jwt, { JwtPayload } from 'jsonwebtoken';


export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded as UserPayload; 
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};