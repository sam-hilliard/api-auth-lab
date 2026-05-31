import { getUserById } from '../../../src/controllers/userController';
import { findUserById } from '../../../src/repositories/userRepository';

jest.mock('../../../src/repositories/userRepository', () => ({
  findUserById: jest.fn(),
}));

const mockFindUserById = findUserById as jest.Mock;

function mockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe('getUserById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user when found', async () => {
    const req: any = {
      params: { id: '1' },
    };

    const res = mockResponse();

    const fakeUser = { id: 1, name: 'Alice' };
    mockFindUserById.mockResolvedValue(fakeUser);

    await getUserById(req, res, jest.fn());

    expect(mockFindUserById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(fakeUser);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 404 when user not found', async () => {
    const req: any = {
      params: { id: '999' },
    };

    const res = mockResponse();

    mockFindUserById.mockResolvedValue(null);

    await getUserById(req, res, jest.fn());

    expect(mockFindUserById).toHaveBeenCalledWith(999);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });
});
