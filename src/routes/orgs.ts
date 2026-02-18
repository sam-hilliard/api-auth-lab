import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { addMember, createOrg } from '../services/orgService';
import { AuthRequest } from '../types/auth';

const router = Router();

// create org
router.post('/', authenticateToken, async (req: AuthRequest, res) => {

    const name = req.body.name;
    const userId = Number(req.user?.userId);

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const org = await createOrg(name);
    const member = await addMember(org.id, userId, 'owner');

    const responseMessage = {
        ...org,
        members: [member]
    }

    res.status(200).json(responseMessage);

});

// invite user
router.post('/:orgId/invite', async (req: AuthRequest, res) => {

});

// org details
// router.get('/:orgId')


export default router;