import { Request, Response } from 'express';
import {
  getOrgDocs,
  getDocById,
  createDocument,
  patchDocument,
  removeDocument,
} from '../../../src/controllers/documentController';

import {
  getDocumentsByOrg,
  getDocument,
  insertDocument,
  updateDocument,
  deleteDocument,
} from '../../../src/repositories/documentRepository';

jest.mock('../../../src/repositories/documentRepository');

const mockedGetDocumentsByOrg = jest.mocked(getDocumentsByOrg);
const mockedGetDocument = jest.mocked(getDocument);
const mockedInsertDocument = jest.mocked(insertDocument);
const mockedUpdateDocument = jest.mocked(updateDocument);
const mockedDeleteDocument = jest.mocked(deleteDocument);

describe('documentController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {
        orgId: '1',
        id: '2',
      },
      body: {
        title: 'Test Title',
        content: 'Test Content',
      },
      user: {
        id: 123,
      },
    } as any;

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('getOrgDocs', () => {
    it('returns all documents for an org', async () => {
      const docs = [
        { id: 1, title: 'Doc 1' },
        { id: 2, title: 'Doc 2' },
      ];

      mockedGetDocumentsByOrg.mockResolvedValue(docs as any);

      await getOrgDocs(req as Request, res as Response);

      expect(mockedGetDocumentsByOrg).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(docs);
    });
  });

  describe('getDocById', () => {
    it('returns a document', async () => {
      const doc = {
        id: 2,
        title: 'Doc 2',
      };

      mockedGetDocument.mockResolvedValue(doc as any);

      await getDocById(req as Request, res as Response);

      expect(mockedGetDocument).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(doc);
    });
  });

  describe('createDocument', () => {
    it('creates and returns a document', async () => {
      const createdDoc = {
        id: 2,
        title: 'Test Title',
        content: 'Test Content',
      };

      mockedInsertDocument.mockResolvedValue(createdDoc as any);

      await createDocument(req as Request, res as Response);

      expect(mockedInsertDocument).toHaveBeenCalledWith(1, 'Test Title', 'Test Content', 123);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdDoc);
    });
  });

  describe('patchDocument', () => {
    it('updates and returns a document', async () => {
      const updatedDoc = {
        id: 2,
        title: 'Updated Title',
        content: 'Updated Content',
      };

      mockedUpdateDocument.mockResolvedValue(updatedDoc as any);

      await patchDocument(req as Request, res as Response);

      expect(mockedUpdateDocument).toHaveBeenCalledWith(1, 2, 'Test Title', 'Test Content');

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedDoc);
    });
  });

  describe('removeDocument', () => {
    it('deletes a document', async () => {
      mockedDeleteDocument.mockResolvedValue(true);

      await removeDocument(req as Request, res as Response);

      expect(mockedDeleteDocument).toHaveBeenCalledWith(1, 2);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Document deleted',
      });
    });
  });
});
