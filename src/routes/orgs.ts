import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  addMember,
  createOrg,
  getMembers,
  isMemberExists,
  getOrg,
  removeMember
} from '../services/orgService';
import { AuthRequest } from '../types/auth';
import { findUserByUsername } from '../services/userService';
import { requireOrg,requireMember, requireOwner, requireTargetMember } from '../middleware/org';
import  documentRoutes from './documents';

const router = Router();

// create org
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const name = req.body.name;
  const userId = Number(req.user?.userId);

  if (!name) {
      return res.status(400).json({ error: 'Name is required' });
  }

  const org = await createOrg(name);
  const responseData = await addMember(org.id, userId, 'owner');

  res.status(201).json(responseData);
});

// get org
router.get('/:orgId', requireOrg, requireMember, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return res.status(200).json({
      ...org,
      members
  });
});

// invite user
router.post('/:orgId/invite', requireOrg, requireOwner, async (req: AuthRequest, res) => {
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

});

// remove member
router.delete('/:orgId/:username',
  authenticateToken,
  requireOrg,
  requireOwner,
  requireTargetMember, 
async (req: AuthRequest, res) => {

  const orgId = Number(req.params.orgId);
  const username = String(req.params.username);

  const findUser = await findUserByUsername(username);
  const userId = Number(findUser?.id);

  const removed = await removeMember(orgId, userId);
  if (!removed) {
    return res.status(400).json({ error: 'Unable to remove member.' })
  }

  return res.status(200).json({ message: 'Successfully removed user from org.'});

});

router.use('/:orgId/documents', documentRoutes);

export default router;
