import {  RequestHandler, Router } from 'express';
import {
  createDocument,
  getDocById,
  getOrgDocs,
  patchDocument,
  removeDocument,
} from '../controllers/documentsController';
import { requireCreator } from '../middlewares/documentsMiddleware';
import { requireOrg, requireMember } from '../middlewares/orgMiddleware';

const router = Router({ mergeParams: true });
router.use(requireOrg as RequestHandler, requireMember);

// Get documents belonging to an org
router.get('/', getOrgDocs as RequestHandler);

// Get a document by ID
router.get('/:id', getDocById as RequestHandler);

// Create a document
router.post('/', createDocument as RequestHandler);

router.patch('/:id', requireCreator as RequestHandler, patchDocument as RequestHandler);

router.delete('/:id', requireCreator as RequestHandler, removeDocument as RequestHandler);

export default router;
