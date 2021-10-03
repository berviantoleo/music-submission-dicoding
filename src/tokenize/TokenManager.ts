import Jwt from '@hapi/jwt';
import InvariantError from '../exceptions/InvariantError';

export interface TokenManager {
  generateAccessToken(payload: Record<string, unknown>): string;
  generateRefreshToken(payload: Record<string, unknown>): string;
  verifyRefreshToken(refreshToken: string): Record<string, unknown>;
}

const tokenManager: TokenManager = {
  generateAccessToken: (payload: Record<string, unknown>) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY || ''),
  generateRefreshToken: (payload: Record<string, unknown>) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY || ''),
  verifyRefreshToken: (refreshToken: string) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY || '');
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

export default tokenManager;
