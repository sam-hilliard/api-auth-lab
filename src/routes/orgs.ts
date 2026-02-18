import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrg } from '../services/orgService';
import { AuthRequest } from '../types/auth';

const router = Router();

// create org
router.post('/', authenticateToken, async (req: AuthRequest, res) => {

    const name = req.body?.name;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    const ownerId = Number(req.user?.userId);

    const org = await createOrg(name, ownerId);
    res.status(200).json(org);

});

// org details
// router.get('/:orgId')

// invite user
// router.post('/:orgId/invite')

export default router;