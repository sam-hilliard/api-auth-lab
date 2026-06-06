import { pool } from '../../../src/db';

import {
  getDocumentsByOrg,
  getDocument,
  insertDocument,
  updateDocument,
  deleteDocument,
  isDocumentCreator,
} from '../../../src/repositories/documentRepository';

jest.mock('../../../src/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockedQuery = jest.mocked(pool.query);

describe('documentRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDocumentsByOrg', () => {
    it('returns documents for org', async () => {
      const rows = [{ id: 1, title: 'Doc' }];

      mockedQuery.mockResolvedValue({ rows } as never);

      const result = await getDocumentsByOrg(1);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM documents d'), [1]);

      expect(result).toEqual(rows);
    });
  });

  describe('getDocument', () => {
    it('returns a single document', async () => {
      const doc = { id: 1, title: 'Doc' };

      mockedQuery.mockResolvedValue({ rows: [doc] } as never);

      const result = await getDocument(1, 2);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE d.org_id = $1 AND d.id = $2'),
        [1, 2],
      );

      expect(result).toEqual(doc);
    });
  });

  describe('insertDocument', () => {
    it('inserts and returns a document', async () => {
      const inserted = { id: 1, title: 'New Doc' };

      mockedQuery.mockResolvedValue({ rows: [inserted] } as never);

      const result = await insertDocument(1, 'New Doc', 'content', 99);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO documents'), [
        1,
        'New Doc',
        'content',
        99,
      ]);

      expect(result).toEqual(inserted);
    });
  });

  describe('updateDocument', () => {
    it('updates and returns document', async () => {
      const updated = { id: 1, title: 'Updated' };

      mockedQuery.mockResolvedValue({ rows: [updated] } as never);

      const result = await updateDocument(1, 2, 'Updated', 'new content');

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('UPDATE documents'), [
        'Updated',
        'new content',
        1,
        2,
      ]);

      expect(result).toEqual(updated);
    });
  });

  describe('deleteDocument', () => {
    it('returns false when delete succeeds (rowCount > 0)', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 1 } as never);

      const result = await deleteDocument(1, 2);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM documents'),
        [1, 2],
      );

      expect(result).toBe(false);
    });

    it('returns true when no rows were deleted', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 0 } as never);

      const result = await deleteDocument(1, 2);

      expect(result).toBe(true);
    });
  });

  describe('isDocumentCreator', () => {
    it('returns true when creator exists', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 1 } as never);

      const result = await isDocumentCreator(1, 2, 3);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT created_by'),
        [1, 2, 3],
      );

      expect(result).toBe(true);
    });

    it('returns false when creator does not match', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 0 } as never);

      const result = await isDocumentCreator(1, 2, 3);

      expect(result).toBe(false);
    });
  });
});
