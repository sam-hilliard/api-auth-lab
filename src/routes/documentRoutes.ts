import { Router } from 'express';
import {
  createDocument,
  getDocById,
  getOrgDocs,
  patchDocument,
  removeDocument,
} from '../controllers/documentController';
import { requireCreator } from '../middlewares/documentMiddleware';
import { requireOrg, requireMember } from '../middlewares/orgMiddleware';
import { validate } from '../middlewares/validateMiddleware';
import {
  documentParamsSchema,
  createDocumentSchema,
  patchDocumentSchema,
} from '../schemas/documentSchema';

const router = Router({ mergeParams: true });
router.use(requireOrg, requireMember);

// Get documents belonging to an org
router.get('/', getOrgDocs);

router.use(validate(documentParamsSchema, 'params'));

// Get a document by ID
router.get('/:id', getDocById);

// Create a document
router.post('/', validate(createDocumentSchema, 'body'), createDocument);

router.patch('/:id', validate(patchDocumentSchema, 'body'), requireCreator, patchDocument);

router.delete('/:id', requireCreator, removeDocument);

export default router;
