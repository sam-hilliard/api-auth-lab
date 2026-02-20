import { AuthRequest } from './auth'

export interface Org {
  id: number;
  name: string;
  owner_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface OrgRequest extends AuthRequest {
  org?: Awaited<ReturnType<typeof getOrg>>;
}
