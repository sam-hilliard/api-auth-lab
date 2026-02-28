import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types/auth';
import { isDocumentCreator } from '../services/documentServices';

export const requireCreator = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

    const docId = Number(req.params.id);
    const userId = Number(req.user?.userId);
    const orgId = Number(req.params.orgId);

    const isCreator = await isDocumentCreator(orgId, docId, userId);
    if (!isCreator) {
        return res.status(401).json({ error: `Unauthorized to access document with ID ${docId}.`});
    }

  next();
};