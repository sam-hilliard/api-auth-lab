import { Router } from 'express';
import { requireCreator } from '../middlewares/documentsMiddleware';
import { requireOrg, requireMember } from '../middlewares/orgMiddleware';
import {
  createDocument,
  getDocById,
  getOrgDocs,
  patchDocument,
  removeDocument,
} from '../controllers/documentsController';

const router = Router({ mergeParams: true });
router.use(requireOrg, requireMember);

// Get documents belonging to an org
router.get('/', getOrgDocs);

// Get a document by ID
router.get('/:id', getDocById);

// Create a document
router.post('/', createDocument);

router.patch('/:id', requireCreator, patchDocument);

router.delete('/:id', requireCreator, removeDocument);

export default router;
