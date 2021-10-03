import {Request, ResponseObject, ResponseToolkit} from '@hapi/hapi';
import { PostPlaylistRequest } from '../../models/requests/PostPlaylistRequest';
import { PostSongToPlaylistRequest } from '../../models/requests/PostSongToPlaylistRequest';
import { StatusDataResponse } from '../../models/response/DataResponse';
import { MessageResponse } from '../../models/response/MessageResponse';
import { PlaylistResponse } from '../../models/response/PlaylistResponse';
import { SimplifiedSong } from '../../models/SimplifiedSong';
import PlaylistsService from "../../services/db/PlaylistsService";
import { PlaylistsValidator } from '../../validator/playlists';

class PlaylistsHandler {

  private service: PlaylistsService;
  private validator: PlaylistsValidator;

  constructor(service: PlaylistsService, validator: PlaylistsValidator) {
    this.service = service;
    this.validator = validator;

    this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
    this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this);
    this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this);
    this.addSongToPlaylistHandler = this.addSongToPlaylistHandler.bind(this);
    this.getSongsFromPlaylistHandler = this.getSongsFromPlaylistHandler.bind(this);
    this.deleteSongFromPlaylistHandler = this.deleteSongFromPlaylistHandler.bind(this);
  }

  async postPlaylistHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      this.validator.validatePostPlaylistPayload(request.payload as PostPlaylistRequest);
      const {
        name,
      } = request.payload as {name: string};

      const { id: credentialId } = request.auth.credentials;
      const playlistId = await this.service.createPlaylist({
        name, owner: credentialId as string,
      });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan',
        data: {
          playlistId,
        },
      });
      response.code(201);
      return response;
  }

  async getPlaylistsHandler(request: Request): Promise<StatusDataResponse<PlaylistResponse[]>> {
    const { id: credentialId } = request.auth.credentials;
    const playlists = await this.service.getPlaylists(credentialId as string);
    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistByIdHandler(request: Request): Promise<MessageResponse> {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistOwner(id, credentialId as string);
      await this.service.deletePlaylistById(id);

      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
      };
  }

  async addSongToPlaylistHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
      this.validator.validatePostSongToPlaylistPayload(request.payload as PostSongToPlaylistRequest);
      const {
        songId,
      } = request.payload as {songId: string};

      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistAccess(playlistId, credentialId as string);
      await this.service.addSongToPlaylist({ playlistId, songId });

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
  }

  async getSongsFromPlaylistHandler(request: Request): Promise<StatusDataResponse<SimplifiedSong[]>> {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistAccess(id, credentialId as string);
      const songs = await this.service.getSongsFromPlaylist(id);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
  }

  async deleteSongFromPlaylistHandler(request: Request): Promise<MessageResponse> {
      this.validator.validatePostSongToPlaylistPayload(request.payload as PostSongToPlaylistRequest);
      const {
        songId,
      } = request.payload as {songId: string};
      const { id: playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this.service.verifyPlaylistAccess(playlistId, credentialId as string);
      await this.service.deleteSongFromPlaylist({ playlistId, songId });

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
  }
}

export default PlaylistsHandler;
