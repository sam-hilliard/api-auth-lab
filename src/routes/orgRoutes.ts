import { Router } from 'express';
import { createOrg, getOrgById, inviteUser } from '../controllers/orgController';
import { authenticateToken } from '../middlewares/auth';
import { requireOrg, requireMember, requireOwner, requireTargetMember } from '../middlewares/org';
import documentRoutes from './documentRoutes';

const router = Router();

// create org
router.post('/', createOrg);

// get org
router.get('/:orgId', requireOrg, requireMember, getOrgById);

// invite user
router.post('/:orgId/invite', requireOrg, requireOwner, inviteUser);

// remove member
router.delete(
  '/:orgId/:username',
  authenticateToken,
  requireOrg,
  requireOwner,
  requireTargetMember,
);

router.use('/:orgId/documents', documentRoutes);

export default router;
