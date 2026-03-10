import { RequestHandler } from 'express';

import {
  getDocumentsByOrg,
  getDocument,
  insertDocument,
  updateDocument,
  deleteDocument,
} from '../services/documentServices';

export const getOrgDocs: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);

  const documents = await getDocumentsByOrg(orgId);
  return res.status(200).json(documents);
};

export const getDocById: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  const document = await getDocument(orgId, docId);
  return res.status(200).json(document);
};

export const createDocument: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);
  const userId = Number(req.user.id);
  const { title, content } = req.body;

  if (!content || !title) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const document = await insertDocument(orgId, title, content, userId);
  return res.status(201).json(document);
};

export const patchDocument: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);
  const { title, content } = req.body;

  if (!content || !title) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const updated = await updateDocument(orgId, docId, title, content);
  return res.status(200).json(updated);
};

export const removeDocument: RequestHandler = async (req, res) => {
  const orgId = Number(req.params.orgId);
  const docId = Number(req.params.id);

  await deleteDocument(orgId, docId);
  return res.status(200).json({ message: 'Document deleted' });
};
