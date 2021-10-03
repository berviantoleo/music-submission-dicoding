import InvariantError from '../../exceptions/InvariantError';
import { UserPayloadSchema } from './schema';
import { UserCreationRequest } from "../../models/UserCreationRequest";

export interface UserValidator {
  validateUserPayload(payload: UserCreationRequest): void;
}

const UsersValidator: UserValidator = {
  validateUserPayload: (payload: UserCreationRequest) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
