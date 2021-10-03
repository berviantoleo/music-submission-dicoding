import InvariantError from '../../exceptions/InvariantError';
import { CollaborationPayloadSchema } from './schema';

export interface CollaborationsValidator {
  validateCollaborationPayload(payload: any): void;
}

const collaborationsValidator: CollaborationsValidator = {
  validateCollaborationPayload: (payload: any) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default collaborationsValidator;
