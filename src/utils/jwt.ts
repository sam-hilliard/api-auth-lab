import jwt from 'jsonwebtoken';

export interface JwtPayload {
    userId: number;
    userName: string;
}

export function signToken(payload: JwtPayload) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
    }

    // TODO: add expiration
    return jwt.sign(payload, JWT_SECRET);
}