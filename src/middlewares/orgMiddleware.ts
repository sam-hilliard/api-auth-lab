import { Request, Response, NextFunction, RequestHandler } from 'express';
import { getOrg } from '../repositories/orgRepository';
import { findUserByUsername } from '../repositories/userRepository';
import { isMemberExists, isOwner } from '../services/orgService';
import { AuthenticatedRequest } from '../types/reqTypes';

export const requireOrg: RequestHandler = async (req, res, next) => {
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
};

export const requireMember: RequestHandler = async (req, res, next) => {
  const { user } = req as AuthenticatedRequest;
  const userId = user.id;
  const orgId = Number(req.params.orgId);

  if (!(await isMemberExists(orgId, userId))) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

export const requireOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req as AuthenticatedRequest;
  const userId = user.id;
  const orgId = Number(req.params.orgId);

  if (!(await isOwner(orgId, userId))) {
    return res.status(403).json({ error: 'Must have owner permissions' });
  }

  next();
};

// TODO: Move to service
export const requireTargetMember = async (req: Request, res: Response, next: NextFunction) => {
  const orgId = Number(req.params.orgId);
  const targetUsername = String(req.params.username);

  const findUser = await findUserByUsername(targetUsername);

  if (!findUser) {
    return res.status(404).json({ error: `${targetUsername} not found` });
  }

  const targetUserId = Number(findUser.id);

  if (!(await isMemberExists(orgId, targetUserId))) {
    return res.status(404).json({ error: `${targetUsername} is not in org` });
  }

  if (await isOwner(orgId, targetUserId)) {
    return res.status(403).json({ error: 'Cannot remove owner' });
  }

  req.targetUser = findUser;

  next();
};
