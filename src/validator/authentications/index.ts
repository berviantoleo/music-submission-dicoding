import {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';
import { RefreshTokenRequest } from '../../models/requests/RefreshTokenRequest';
import { LoginRequest } from '../../models/requests/LoginRequest';

export interface AuthenticationsValidator {
  validatePostAuthenticationPayload(payload: LoginRequest): void;
  validatePutAuthenticationPayload(payload: RefreshTokenRequest): void;
  validateDeleteAuthenticationPayload(payload: RefreshTokenRequest): void;
}

const authenticationsValidator: AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload: LoginRequest) => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePutAuthenticationPayload: (payload: RefreshTokenRequest) => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateDeleteAuthenticationPayload: (payload: RefreshTokenRequest) => {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default authenticationsValidator;
