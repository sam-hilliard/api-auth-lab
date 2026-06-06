import { Request, Response, NextFunction } from 'express';
import {
  requireOrg,
  requireMember,
  requireOwner,
  requireTargetMember,
} from '../../../src/middlewares/orgMiddleware';

import { getOrg } from '../../../src/repositories/orgRepository';
import { findUserByUsername } from '../../../src/repositories/userRepository';
import { isMemberExists, isOwner } from '../../../src/services/orgService';

jest.mock('../../../src/repositories/orgRepository');
jest.mock('../../../src/repositories/userRepository');
jest.mock('../../../src/services/orgService');

const mockedGetOrg = jest.mocked(getOrg);
const mockedFindUserByUsername = jest.mocked(findUserByUsername);
const mockedIsMemberExists = jest.mocked(isMemberExists);
const mockedIsOwner = jest.mocked(isOwner);

describe('org middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {
        orgId: '1',
        username: 'john',
      },
      user: {
        id: 123,
        username: 'testuser',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe('requireOrg', () => {
    it('returns 400 for invalid org id', async () => {
      req.params = { orgId: 'abc' };

      await requireOrg(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid org id',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 404 when org is not found', async () => {
      mockedGetOrg.mockResolvedValue(null);

      await requireOrg(req as Request, res as Response, next);

      expect(mockedGetOrg).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Org not found',
      });
    });

    it('attaches org and calls next', async () => {
      const org = {
        id: 1,
        name: 'Test Org',
      };

      mockedGetOrg.mockResolvedValue(org as unknown as Response);

      await requireOrg(req as Request, res as Response, next);

      expect(req.org).toEqual(org);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireMember', () => {
    it('returns 403 when user is not a member', async () => {
      mockedIsMemberExists.mockResolvedValue(false);

      await requireMember(req as Request, res as Response, next);

      expect(mockedIsMemberExists).toHaveBeenCalledWith(1, 123);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Forbidden',
      });
    });

    it('calls next when user is a member', async () => {
      mockedIsMemberExists.mockResolvedValue(true);

      await requireMember(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireOwner', () => {
    it('returns 403 when user is not an owner', async () => {
      mockedIsOwner.mockResolvedValue(false);

      await requireOwner(req as Request, res as Response, next);

      expect(mockedIsOwner).toHaveBeenCalledWith(1, 123);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Must have owner permissions',
      });
    });

    it('calls next when user is an owner', async () => {
      mockedIsOwner.mockResolvedValue(true);

      await requireOwner(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('requireTargetMember', () => {
    it('returns 404 when target user does not exist', async () => {
      mockedFindUserByUsername.mockResolvedValue(null);

      await requireTargetMember(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'john not found',
      });
    });

    it('returns 404 when target user is not a member', async () => {
      mockedFindUserByUsername.mockResolvedValue({
        id: 999,
        username: 'john',
      });

      mockedIsMemberExists.mockResolvedValue(false);

      await requireTargetMember(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'john is not in org',
      });
    });

    it('returns 403 when target user is an owner', async () => {
      mockedFindUserByUsername.mockResolvedValue({
        id: 999,
        username: 'john',
      });

      mockedIsMemberExists.mockResolvedValue(true);
      mockedIsOwner.mockResolvedValue(true);

      await requireTargetMember(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Cannot remove owner',
      });
    });

    it('attaches targetUser and calls next', async () => {
      const user = {
        id: 999,
        username: 'john',
      };

      mockedFindUserByUsername.mockResolvedValue(user);
      mockedIsMemberExists.mockResolvedValue(true);
      mockedIsOwner.mockResolvedValue(false);

      await requireTargetMember(req as Request, res as Response, next);

      expect(req.targetUser).toEqual(user);
      expect(next).toHaveBeenCalled();
    });
  });
});
