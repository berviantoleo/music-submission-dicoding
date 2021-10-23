import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { StatusDataResponse } from '../../models/response/DataResponse';
import { MessageResponse } from '../../models/response/MessageResponse';
import { SimplifiedSong } from '../../models/SimplifiedSong';
import { Song } from '../../models/Song';
import { SongRequest } from '../../models/requests/SongRequest';
import SongService from '../../services/db/SongService';
import { SongValidator } from '../../validator/songs';

class SongHandler {
  private service: SongService;
  private validator: SongValidator;
  constructor(service: SongService, validator: SongValidator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    this.validator.validateSongPayload(<SongRequest>request.payload);
    const {
      title, year, performer, genre, duration,
    } = <SongRequest>request.payload;

    const songId = await this.service.addSong({
      title, year, performer, genre, duration,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(): Promise<StatusDataResponse<SimplifiedSong[]>> {
    const songs = await this.service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request: Request): Promise<StatusDataResponse<Song>> {
    const { id } = request.params;
    const song = await this.service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request: Request): Promise<MessageResponse> {
    this.validator.validateSongPayload(<SongRequest>request.payload);
    const {
      title, year, performer, genre, duration,
    } = <SongRequest>request.payload;
    const { id } = request.params;

    await this.service.editSongById(id, {
      title, year, performer, genre, duration,
    });

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request: Request): Promise<MessageResponse> {
    const { id } = request.params;
    await this.service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

export default SongHandler;
