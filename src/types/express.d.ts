import { Document } from './documentTypes';
import { Org } from './orgTypes';
import { User } from './userTypes';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      org?: Org;
      document?: Document;
    }
  }
}
