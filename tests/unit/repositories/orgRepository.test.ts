import { pool } from '../../../src/db';

import {
  insertOrg,
  getOrg,
  insertMember,
  getMember,
  getMembers,
  deleteMember,
} from '../../../src/repositories/orgRepository';

jest.mock('../../../src/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockedQuery = jest.mocked(pool.query);

describe('orgRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('insertOrg', () => {
    it('inserts org and returns it', async () => {
      const org = { id: 1, name: 'Acme' };

      mockedQuery.mockResolvedValue({ rows: [org] } as never);

      const result = await insertOrg('Acme');

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO orgs'), [
        'Acme',
      ]);

      expect(result).toEqual(org);
    });
  });

  describe('getOrg', () => {
    it('returns an org by id', async () => {
      const org = { id: 1, name: 'Acme' };

      mockedQuery.mockResolvedValue({ rows: [org] } as never);

      const result = await getOrg(1);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM orgs'), [1]);

      expect(result).toEqual(org);
    });
  });

  describe('insertMember', () => {
    it('inserts a member', async () => {
      mockedQuery.mockResolvedValue({ rows: [] } as never);

      await insertMember(1, 2, 'admin');

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO org_members'), [
        1,
        2,
        'admin',
      ]);
    });
  });

  describe('getMember', () => {
    it('returns a member', async () => {
      const member = { org_id: 1, user_id: 2, role: 'admin' };

      mockedQuery.mockResolvedValue({ rows: [member] } as never);

      const result = await getMember(1, 2);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM org_members'), [1, 2]);

      expect(result).toEqual(member);
    });
  });

  describe('getMembers', () => {
    it('returns all members for org', async () => {
      const members = [
        { username: 'alice', role: 'admin' },
        { username: 'bob', role: 'member' },
      ];

      mockedQuery.mockResolvedValue({ rows: members } as never);

      const result = await getMembers(1);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM org_members'), [1]);

      expect(result).toEqual(members);
    });
  });

  describe('deleteMember', () => {
    it('returns true when a row is deleted', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 1 } as never);

      const result = await deleteMember(1, 2);

      expect(mockedQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM org_members'),
        [1, 2],
      );

      expect(result).toBe(true);
    });

    it('returns false when no row is deleted', async () => {
      mockedQuery.mockResolvedValue({ rowCount: 0 } as never);

      const result = await deleteMember(1, 2);

      expect(result).toBe(false);
    });
  });
});
