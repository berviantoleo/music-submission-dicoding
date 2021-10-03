import { SongPayloadSchema } from './schema';
import InvariantError from '../../exceptions/InvariantError';
import { SongRequest } from '../../models/requests/SongRequest';

export interface SongValidator {
  validateSongPayload(payload: SongRequest): void;
}

const songValidator : SongValidator = {
  validateSongPayload: (payload: SongRequest) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default songValidator;
