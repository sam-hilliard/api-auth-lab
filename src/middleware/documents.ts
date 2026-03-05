import { RequestHandler } from 'express';
import { isDocumentCreator } from '../services/documentServices';

export const requireCreator: RequestHandler = async (req, res, next) => {
  const docId = Number(req.params.id);
  const userId = Number(req.user.id);
  const orgId = Number(req.params.orgId);

  const isCreator = await isDocumentCreator(orgId, docId, userId);
  if (!isCreator) {
    return res.status(403).json({ error: `Unauthorized to access document with ID ${docId}.` });
  }

  next();
};
