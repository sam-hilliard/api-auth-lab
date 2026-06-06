import { pool } from '../../../src/db';

import {
  findUserById,
  findUserByUsername,
  createUser,
} from '../../../src/repositories/userRepository';

jest.mock('../../../src/db', () => ({
  pool: {
    query: jest.fn(),
  },
}));

const mockedQuery = jest.mocked(pool.query);

describe('userRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findUserById', () => {
    it('returns a user when found', async () => {
      const user = { id: 1, username: 'alice' };

      mockedQuery.mockResolvedValue({ rows: [user] } as never);

      const result = await findUserById(1);

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM users'), [1]);

      expect(result).toEqual(user);
    });

    it('returns null when user not found', async () => {
      mockedQuery.mockResolvedValue({ rows: [] } as never);

      const result = await findUserById(1);

      expect(result).toBeNull();
    });
  });

  describe('findUserByUsername', () => {
    it('returns a user when found', async () => {
      const user = {
        id: 1,
        username: 'alice',
        password: 'hashed',
      };

      mockedQuery.mockResolvedValue({ rows: [user] } as never);

      const result = await findUserByUsername('alice');

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('FROM users'), ['alice']);

      expect(result).toEqual(user);
    });

    it('returns null when user not found', async () => {
      mockedQuery.mockResolvedValue({ rows: [] } as never);

      const result = await findUserByUsername('alice');

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('creates and returns a user', async () => {
      const created = {
        id: 1,
        username: 'alice',
      };

      mockedQuery.mockResolvedValue({ rows: [created] } as never);

      const result = await createUser('alice', 'hashed-password');

      expect(mockedQuery).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), [
        'alice',
        'hashed-password',
      ]);

      expect(result).toEqual(created);
    });
  });
});
