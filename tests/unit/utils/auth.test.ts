import { buildAuthResponse } from '../../../src/utils/auth';
import { signToken } from '../../../src/utils/jwt';

jest.mock('../../../src/utils/jwt', () => ({
  signToken: jest.fn(),
}));

const mockedSignToken = jest.mocked(signToken);

describe('buildAuthResponse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns payload with authToken', () => {
    const payload = {
      id: 1,
      username: 'alice',
    };

    mockedSignToken.mockReturnValue('mock-token' as never);

    const result = buildAuthResponse(payload);

    expect(mockedSignToken).toHaveBeenCalledWith(payload);

    expect(result).toEqual({
      id: 1,
      username: 'alice',
      authToken: 'mock-token',
    });
  });
});
