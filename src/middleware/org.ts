import { Request, Response, NextFunction } from 'express';
import {
  getOrg,
  isMemberExists,
  isOwner,
} from '../services/orgService'
import { findUserByUsername } from '../services/userService';
import { OrgRequest } from '../types/org';

export async function requireOrg(
  req: OrgRequest,
  res: Response,
  next: NextFunction
) {
  const orgId = Number(req.params.orgId);

  if (isNaN(orgId)) {
    return res.status(400).json({ error: 'Invalid org id' });
  }

  const org = await getOrg(orgId);

  if (!org) {
    return res.status(404).json({ error: 'Org not found' });
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
    return res.status(403).json({ error: 'Must have owner permissions' });
  }

  next();
}

export async function requireTargetMember(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const orgId = Number(req.params.orgId);
  const targetUsername = String(req.params.username);

  const findUser = await findUserByUsername(targetUsername);
  const targetUserId = Number(findUser?.id);

  if (!(await isMemberExists(orgId, targetUserId))) {
    return res.status(404).json({ error: `${targetUsername} is not in org` });
  }

  (req as any).targetUser = findUser?.username;

  next();
}
