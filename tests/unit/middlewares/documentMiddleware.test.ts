import { Request, Response, NextFunction } from 'express';
import { requireCreator } from '../../../src/middlewares/documentMiddleware';
import { isDocumentCreator } from '../../../src/repositories/documentRepository';

jest.mock('../../../src/repositories/documentRepository');

const mockedIsDocumentCreator = jest.mocked(isDocumentCreator);

describe('requireCreator', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      params: {
        id: '123',
        orgId: '456',
      },
      user: {
        id: 789,
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

  it('calls next when the user is the document creator', async () => {
    mockedIsDocumentCreator.mockResolvedValue(true);

    await requireCreator(req as Request, res as Response, next);

    expect(mockedIsDocumentCreator).toHaveBeenCalledWith(456, 123, 789);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns 403 when the user is not the document creator', async () => {
    mockedIsDocumentCreator.mockResolvedValue(false);

    await requireCreator(req as Request, res as Response, next);

    expect(mockedIsDocumentCreator).toHaveBeenCalledWith(456, 123, 789);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Unauthorized to access document with ID 123.',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
