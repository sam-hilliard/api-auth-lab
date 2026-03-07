import { Document } from './document';
import { Org } from './org';
import { User } from './userTypes';

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
