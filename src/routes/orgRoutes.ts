import { Router } from 'express';
import { createOrg, getOrgById, inviteUser, removeMember } from '../controllers/orgController';
import { requireOrg, requireMember, requireOwner, requireTargetMember } from '../middlewares/orgMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import { createOrgBodySchema, inviteUserBodySchema, orgParamsSchema, deleteParamsSchema } from '../schemas/orgSchema';
import documentRoutes from './documentRoutes';

const router = Router();

// create org
router.post('/', validate(createOrgBodySchema,'body'), createOrg);

// get org
router.get('/:orgId', validate(orgParamsSchema, 'params'), requireOrg, requireMember, getOrgById);

// invite user
router.post('/:orgId/invite', validate(orgParamsSchema, 'params'), validate(inviteUserBodySchema, 'body'), requireOrg, requireOwner, inviteUser);

// remove member
router.delete(
  '/:orgId/:username',
  validate(deleteParamsSchema, 'params'),
  requireOrg,
  requireOwner,
  requireTargetMember,
  removeMember
);

router.use('/:orgId/documents', validate(orgParamsSchema, 'params'), documentRoutes);

export default router;
