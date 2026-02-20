import { Response, NextFunction } from 'express';
import { getOrg } from '../services/orgService';
import { isMemberExists } from '../services/orgService';
import { isOwner } from '../services/orgService';
import { OrgRequest } from '../types/org';

export async function requireOrg(
  req: OrgRequest,
  res: Response,
  next: NextFunction
) {
  const orgId = Number(req.params.orgId);

  if (isNaN(orgId)) {
    return res.status(400).json({ message: 'Invalid org id' });
  }

  const org = await getOrg(orgId);

  if (!org) {
    return res.status(404).json({ message: 'Org not found' });
  }

  req.org = org;
  next();
}

export async function requireMember(
  req: OrgRequest,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.user?.userId);
  const orgId = Number(req.params.orgId);

  if (!(await isMemberExists(orgId, userId))) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
}

export async function requireOwner(
  req: OrgRequest,
  res: Response,
  next: NextFunction
) {
  const userId = Number(req.user?.userId);
  const orgId = Number(req.params.orgId);

  if (!(await isOwner(orgId, userId))) {
    return res.status(403).json({ message: 'Only owners allowed' });
  }

  next();
}
