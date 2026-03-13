import { Request, Response } from 'express'
import {
  addMember,
  getOrg,
  getMembers,
  insertOrg,
  inviteUserToOrg,
  removeMemberFromOrg,
} from '../services/orgService';

export const createOrg = async (req: Request, res: Response) => {
  const name = req.body.name;
  const userId = req.user.id;

  const org = await insertOrg(name);
  const responseData = await addMember(org.id, userId, 'owner');

  res.status(201).json(responseData);
};

export const getOrgById = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return res.status(200).json({
    ...org,
    members,
  });
};

export const inviteUser = async (req: Request, res: Response) => {
  const username = req.body.username;
  const orgId = req.params.orgId;

  const member = await inviteUserToOrg(orgId, username);
  return res.status(201).json(member);
};

export const removeMember = async (req: Request<DeleteParams>, res: Response) => {
  const { orgId, username } = req.params;
  await removeMemberFromOrg(orgId, username);

  return res.status(204).send();
};
