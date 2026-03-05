import { UserPayload } from './auth';
import { Document } from './document';
import { Org } from './org';

declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
      org: Org;
      document: Document;
      targetUser: UserPayload;
    }
  }
}
