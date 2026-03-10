import { RequestHandler } from 'express';
import {
  addMember,
  getOrg,
  getMembers,
  insertOrg,
  deleteMember,
  isMemberExists,
} from '../services/orgService';
import { findUserByUsername } from '../services/userService';

export const createOrg: RequestHandler = async (req, res) => {
  const name = req.body.name;
  const userId = Number(req.user.id);

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const org = await insertOrg(name);
  const responseData = await addMember(org.id, userId, 'owner');

  res.status(201).json(responseData);
};

export const getOrgById: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return res.status(200).json({
    ...org,
    members,
  });
};

export const inviteUser: RequestHandler = async (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const orgId = Number(req.params.orgId);

  // check that user exists
  const findUser = await findUserByUsername(username);
  const userId = findUser?.id;
  if (!userId) {
    return res.status(404).json({ error: `User does not exist with the username: ${username}` });
  }

  // check that member does not already exist
  const memberExists = await isMemberExists(orgId, userId);
  if (memberExists) {
    return res.status(400).json({ error: 'User is already a member of the org' });
  }

  const responseData = await addMember(orgId, userId, 'member');
  return res.status(201).json(responseData);
};

export const removeMember: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);
  const username = String(req.params.username);

  const findUser = await findUserByUsername(username);
  const userId = Number(findUser?.id);

  const removed = await deleteMember(orgId, userId);
  if (!removed) {
    return res.status(400).json({ error: 'Unable to remove member.' });
  }

  return res.status(200).json({ message: 'Successfully removed user from org.' });
};
