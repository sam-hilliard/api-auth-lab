import bcrypt from 'bcrypt';
import { findUserByUsername, createUser } from '../../../src/repositories/userRepository';
import { login, signup } from '../../../src/services/authService';

jest.mock('../../../src/repositories/userRepository');
jest.mock('bcrypt');

const mockFindUserByUsername = jest.mocked(findUserByUsername);
const mockCreateUser = jest.mocked(createUser);
const mockCompare = bcrypt.compare as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null if user not found', async () => {
    mockFindUserByUsername.mockResolvedValue(null);

    await expect(login('user', 'pass')).resolves.toBeNull();
  });

  test('returns null if password is missing on user', async () => {
    mockFindUserByUsername.mockResolvedValue({
      id: 1,
      username: 'user',
      password: undefined,
    });

    await expect(login('user', 'pass')).resolves.toBeNull();
  });

  test('returns null if password is invalid', async () => {
    mockFindUserByUsername.mockResolvedValue({
      id: 1,
      username: 'user',
      password: 'hashed-password',
    });

    mockCompare.mockResolvedValue(false);

    await expect(login('user', 'invalidPass')).resolves.toBeNull();
  });

  test('returns user if credentials are valid', async () => {
    const user = {
      id: 1,
      username: 'user',
      password: 'hashed-password',
    };

    mockFindUserByUsername.mockResolvedValue(user);
    mockCompare.mockResolvedValue(true);

    const result = await login('user', 'validPass');

    expect(result).toEqual(user);

    expect(mockCompare).toHaveBeenCalledWith('validPass', 'hashed-password');
  });
});

describe('signup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null if user already exists', async () => {
    mockFindUserByUsername.mockResolvedValue({
      id: 1,
      username: 'existing-user',
      password: 'hashed-password',
    });

    await expect(signup('existing-user', 'password')).resolves.toBeNull();

    expect(mockHash).not.toHaveBeenCalled();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  test('creates user with hashed password', async () => {
    mockFindUserByUsername.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashed-password');

    const createdUser = {
      id: 1,
      username: 'new-user',
      password: 'hashed-password',
    };

    mockCreateUser.mockResolvedValue(createdUser);

    const result = await signup('new-user', 'password123');

    expect(result).toEqual(createdUser);

    expect(mockHash).toHaveBeenCalledWith('password123', 10);

    expect(mockCreateUser).toHaveBeenCalledWith('new-user', 'hashed-password');
  });
});
