import InvariantError from '../../exceptions/InvariantError';
import { CollaborationRequest } from '../../models/requests/CollaborationRequest';
import { CollaborationPayloadSchema } from './schema';

export interface CollaborationsValidator {
  validateCollaborationPayload(payload: CollaborationRequest): void;
}

const collaborationsValidator: CollaborationsValidator = {
  validateCollaborationPayload: (payload: CollaborationRequest) => {
    const validationResult = CollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default collaborationsValidator;
