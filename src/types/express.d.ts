import { User } from './userTypes';
import { Document } from './document';
import { Org } from './org';

declare global {
  namespace Express {
    interface Request {
      user: User;
      org: Org;
      document: Document;
      targetUser: User;
    }
  }
}
