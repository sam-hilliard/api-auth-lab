import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  addMember,
  createOrg,
  isOwner,
  isMemberExists,
  getMembers,
  getOrg
} from '../services/orgService';
import { AuthRequest } from '../types/auth';
import { findUserByUsername } from '../services/userService';
import { requireOrg,requireMember, requireOwner } from '../middleware/org';

const router = Router();

// create org
router.post('/', authenticateToken, async (req: AuthRequest, res) => {

    const name = req.body.name;
    const userId = Number(req.user?.userId);

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const org = await createOrg(name);
    const responseData = await addMember(org.id, userId, 'owner');

    res.status(201).json(responseData);
});

// get org
router.get('/:orgId', requireOrg, requireMember, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);
  const userId = Number(req.user?.userId);

  const org = await getOrg(orgId);
  const members = await getMembers(orgId);
  return res.status(200).json({
      ...org,
      members
  });
});

// invite user
router.post('/:orgId/invite', requireOrg, requireOwner, requireMember, async (req: AuthRequest, res) => {

    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const orgId = Number(req.params.orgId);

    // check that user exists
    const findUser = await findUserByUsername(username);
    const userId = findUser?.id;
    if (!userId) {
       return res.status(404).json({ message: `User does not exist with the username: ${username}` }); 
    }

  const responseData = await addMember(orgId, userId, 'member');
  return res.status(201).json(responseData);

});

export default router;
