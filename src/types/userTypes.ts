import { JwtPayload } from '../schemas/auth';

export interface User extends JwtPayload {
    password?: string;
}