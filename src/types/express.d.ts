import { Org } from './orgTypes';
import { User } from './userTypes';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      org?: Org;
      targetUser?: User;
    }
  }
}
