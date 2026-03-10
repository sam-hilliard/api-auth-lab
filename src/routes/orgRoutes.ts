import { Router } from 'express';
import { createOrg, getOrgById, inviteUser } from '../controllers/orgController';
import { requireOrg, requireMember, requireOwner, requireTargetMember } from '../middlewares/orgMiddleware';
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
  requireOrg,
  requireOwner,
  requireTargetMember,
);

router.use('/:orgId/documents', documentRoutes);

export default router;
