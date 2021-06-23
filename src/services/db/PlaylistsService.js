const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapList, playlistMap } = require('../../utils/mapper');

const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor(collaborationService, songService, cacheService) {
    this.pool = new Pool();
    this.collaborationService = collaborationService;
    this.songService = songService;
    this.cacheService = cacheService;
  }

  async createPlaylist({ name, owner }) {
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

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN collaborations ON collaborations."playlistId" = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations."userId" = $1`,
      values: [owner],
    };
    const result = await this.pool.query(query);
    return result.rows.map(playlistMap);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async addSongToPlaylist({ playlistId, songId }) {
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

  async getSongsFromPlaylist(playlistId) {
    try {
      const result = await this.cacheService.get(`playlistSong:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.* FROM playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs."songId"
      WHERE playlistsongs."playlistId" = $1`,
        values: [playlistId],
      };
      const result = await this.pool.query(query);
      const mappedResult = result.rows.map(mapList);
      await this.cacheService.set(`playlistSong:${playlistId}`, JSON.stringify(mappedResult));
      return mappedResult;
    }

  }

  async deleteSongFromPlaylist({ playlistId, songId }) {
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

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
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

  async verifyPlaylistAccess(playlistId, userId) {
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

module.exports = PlaylistsService;
