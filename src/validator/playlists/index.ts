import {
  PostPlaylistPayloadSchema,
  PostSongToPlaylistPayloadSchema,
} from './schema';
import InvariantError from '../../exceptions/InvariantError';
import { PostPlaylistRequest } from '../../models/requests/PostPlaylistRequest';
import { PostSongToPlaylistRequest } from '../../models/requests/PostSongToPlaylistRequest';

export interface PlaylistsValidator {
  validatePostPlaylistPayload(payload: PostPlaylistRequest): void;
  validatePostSongToPlaylistPayload(payload: PostSongToPlaylistRequest): void;
}

const playlistsValidator: PlaylistsValidator = {
  validatePostPlaylistPayload: (payload: PostPlaylistRequest) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePostSongToPlaylistPayload: (payload: PostSongToPlaylistRequest) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default playlistsValidator;
