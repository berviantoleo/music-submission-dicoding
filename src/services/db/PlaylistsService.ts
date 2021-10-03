import { Pool } from "pg";
import { nanoid } from 'nanoid';
import CacheService from "../redis/CacheService";
import CollaborationsService from "./CollaborationsService";
import SongService from "./SongService";
import AuthorizationError from '../../exceptions/AuthorizationError';
import NotFoundError from '../../exceptions/NotFoundError';
import InvariantError from '../../exceptions/InvariantError';
import { PlaylistResponse } from "../../models/response/PlaylistResponse";
import { SimplifiedSong } from "../../models/SimplifiedSong";

class PlaylistsService {
  private pool: Pool;
  private collaborationService: CollaborationsService;
  private songService: SongService;
  private cacheService: CacheService;

  constructor(collaborationService: CollaborationsService, songService: SongService, cacheService: CacheService) {
    this.pool = new Pool();
    this.collaborationService = collaborationService;
    this.songService = songService;
    this.cacheService = cacheService;
  }

  async createPlaylist({ name, owner }: { name: string, owner: string }): Promise<string> {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner: string): Promise<PlaylistResponse[]> {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username FROM playlists
      LEFT JOIN collaborations ON collaborations."playlistId" = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations."userId" = $1`,
      values: [owner],
    };
    const result = await this.pool.query<PlaylistResponse>(query);
    return result.rows;
  }

  async deletePlaylistById(id: string): Promise<void> {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist({ playlistId, songId }: { playlistId: string, songId: string }): Promise<void> {
    await this.songService.getSongById(songId);
    const id = `ps-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }
    await this.cacheService.delete(`playlistSong:${playlistId}`);
  }

  async getSongsFromPlaylist(playlistId: string): Promise<SimplifiedSong[]> {
    try {
      const result = await this.cacheService.get(`playlistSong:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs."songId"
      WHERE playlistsongs."playlistId" = $1`,
        values: [playlistId],
      };
      const result = await this.pool.query<SimplifiedSong>(query);
      const data = result.rows;
      await this.cacheService.set(`playlistSong:${playlistId}`, JSON.stringify(data));
      return data;
    }
  }

  async deleteSongFromPlaylist({ playlistId, songId }: { playlistId: string, songId: string }): Promise<void> {
    try {
      await this.songService.getSongById(songId);
      const query = {
        text: 'DELETE FROM playlistsongs WHERE "playlistId" = $1 AND "songId" = $2 RETURNING id',
        values: [playlistId, songId],
      };
      const result = await this.pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Lagu gagal dihapus dari playlist');
      }

      await this.cacheService.delete(`playlistSong:${playlistId}`);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // mutasi ke invariant
        throw new InvariantError(error.message);
      }
    }
  }

  async verifyPlaylistOwner(id: string, owner: string): Promise<void> {
    const query = {
      text: 'SELECT id, owner FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId: string, userId: string): Promise<void> {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

export default PlaylistsService;
