import jwt from 'jsonwebtoken';
import { JwtPayload } from '../../../src/schemas/authSchema';
import { signToken } from '../../../src/utils/jwt';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('signToken', () => {
  const originalEnv = process.env;
  const payload: JwtPayload = {
    id: 123,
    username: 'test_user',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('throws if JWT_SECRET is not defined', () => {
    delete process.env.JWT_SECRET;

    expect(() => signToken(payload)).toThrow('JWT_SECRET is not defined');
  });

  it('signs and returns a token when JWT_SECRET is defined', () => {
    process.env.JWT_SECRET = 'test-secret';

    (jwt.sign as jest.Mock).mockReturnValue('mock-token');

    const result = signToken(payload);

    expect(jwt.sign).toHaveBeenCalledWith(payload, 'test-secret', { expiresIn: '15m' });

    expect(result).toBe('mock-token');
  });
});
