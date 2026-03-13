import { JwtPayload } from '../schemas/authSchema';

export interface User extends JwtPayload {
  password?: string;
}
