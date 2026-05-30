import { Request, Response } from 'express';
import {
  getDocumentsByOrg,
  getDocument,
  insertDocument,
  updateDocument,
  deleteDocument,
} from '../repositories/documentRepository';
import { AuthenticatedRequest } from '../types/reqTypes';

export const getOrgDocs = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);

  const documents = await getDocumentsByOrg(orgId);
  return res.status(200).json(documents);
};

export const getDocById = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  const document = await getDocument(orgId, docId);
  return res.status(200).json(document);
};

export const createDocument = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const { user } = req as AuthenticatedRequest;
  const userId = Number(user.id);
  const { title, content } = req.body;

  const document = await insertDocument(orgId, title, content, userId);
  return res.status(201).json(document);
};

export const patchDocument = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);
  const { title, content } = req.body;

  const updated = await updateDocument(orgId, docId, title, content);
  return res.status(200).json(updated);
};

export const removeDocument = async (req: Request, res: Response) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  await deleteDocument(orgId, docId);
  return res.status(200).json({ message: 'Document deleted' });
};
