import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { addMember, createOrg, isOwner, isMemberExists, getMembers } from '../services/orgService';
import { AuthRequest } from '../types/auth';
import { findUserByUsername } from '../services/userService';

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

// invite user
router.post('/:orgId/invite', async (req: AuthRequest, res) => {

    const username = req.body.username;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const orgId = Number(req.params.orgId);
    const ownerId = Number(req.user?.userId);

    // check that owner is inviting member
    if (!(await isOwner(orgId, ownerId))) {
        return res.status(401).json({ message: 'Only owners can invite members' });
    }

    // check that user exists
    const findUser = await findUserByUsername(username);
    const userId = findUser?.id;
    if (!userId) {
       return res.status(404).json({ message: `User does not exist with the username: ${username}` }); 
    }

    // check that member does not already exist in org
    if (await isMemberExists(orgId, userId)) {
        return res.status(400).json({ message: `${username} already exists in org` });
    }


  const responseData = await addMember(orgId, userId, 'member');
  return res.status(201).json(responseData);

});

// org details
// router.get('/:orgId')


export default router;
