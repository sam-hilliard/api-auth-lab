import { JwtPayload } from '../schemas/authSchema';
import { signToken } from '../utils/jwt';

export const buildAuthResponse = (payload: JwtPayload) => {
  return {
    ...payload,
    authToken: signToken(payload),
  };
};
