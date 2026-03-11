import { signToken } from '../utils/jwt';
import { JwtPayload } from '../schemas/auth';

export const buildAuthResponse = (payload: JwtPayload) => {
  return {
    ...payload,
    authToken: signToken(payload),
  };
};
