import {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';

export interface PlaylistsValidator {
  validatePostPlaylistPayload(payload: any): void;
  validatePostSongToPlaylistPayload(payload: any): void;
}

const playlistsValidator: PlaylistsValidator = {
  validatePostPlaylistPayload: (payload: any) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload: any) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default playlistsValidator;
