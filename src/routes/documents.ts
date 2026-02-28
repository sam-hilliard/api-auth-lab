// routes/documents.ts
import { Router } from 'express';
import { AuthRequest } from '../types/auth';
import { requireOrg, requireMember } from '../middleware/org';
import { requireCreator } from '../middleware/documents';
import {
    getDocumentsByOrg,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument
} from '../services/documentServices';

const router = Router({ mergeParams: true });
router.use(requireOrg, requireMember);

// Get documents belonging to an org
router.get('/', requireOrg, requireMember, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);

  const documents = await getDocumentsByOrg(orgId);
  return res.status(200).json(documents);
});

// Get a document by ID
router.get('/:id', requireOrg, requireMember, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  const document = await getDocument(orgId, docId);
  return res.status(200).json(document);
});

// Create a document
router.post('/', requireOrg, requireMember, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);
  const userId = Number(req.user?.userId);
  const { title, content } = req.body;

  if (!content || !title) {
      return res.status(400).json({ error: 'Title and content are required' });
  }

  const document = await createDocument(orgId, title, content, userId);
  return res.status(201).json(document);
});

router.patch('/:id', requireOrg, requireMember, requireCreator, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  const updated = await updateDocument(orgId, docId, req.body.title, req.body.content);
  return res.status(200).json(updated);
});

router.delete('/:id', requireOrg, requireMember, requireCreator, async (req: AuthRequest, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  await deleteDocument(orgId, docId);
  return res.status(200).json({ message: 'Document deleted' });
});

export default router;