import { RequestHandler } from 'express';
import { isDocumentCreator } from '../services/documentServices';
import { AuthenticatedRequest } from '../types/reqTypes';

export const requireCreator: RequestHandler = async (req, res, next) => {
  const { user } = req as AuthenticatedRequest;
  const docId = Number(req.params.id);
  const userId = user.id;
  const orgId = Number(req.params.orgId);

  const isCreator = await isDocumentCreator(orgId, docId, userId);
  if (!isCreator) {
    return res.status(403).json({ error: `Unauthorized to access document with ID ${docId}.` });
  }

  next();
};
