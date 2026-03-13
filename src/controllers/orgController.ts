import { Request, Response } from 'express';
import { TypedRequest } from '../types/TypedRequest';
import {
  addMember,
  getOrg,
  getMembers,
  insertOrg,
  inviteUserToOrg,
  removeMemberFromOrg,
} from '../services/orgService';
import { OrgParams, DeleteParams, InviteUserBody, CreateOrgBody } from '../schemas/orgSchema';

export const createOrg = async (req: TypedRequest<CreateOrgBody>, res: Response) => {
  const name = req.body.name;
  const userId = req.user.id;

  const org = await insertOrg(name);
  const responseData = await addMember(org.id, userId, 'owner');

  res.status(201).json(responseData);
};

export const getOrgById = async (req: Request<OrgParams>, res: Response) => {
  const orgId = Number(req.params.orgId);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return res.status(200).json({
    ...org,
    members,
  });
};

export const inviteUser = async (req: Request<OrgParams, InviteUserBody>, res: Response) => {
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
