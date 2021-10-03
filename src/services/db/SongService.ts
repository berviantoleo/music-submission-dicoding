import { Pool } from 'pg';
import { nanoid } from 'nanoid';

import NotFoundError from '../../exceptions/NotFoundError';
import InvariantError from '../../exceptions/InvariantError';
import CacheService from '../redis/CacheService';
import { SongRequest } from '../../models/SongRequest';
import { IdBased } from '../../models/IdBased';
import { SimplifiedSong } from '../../models/SimplifiedSong';
import { Song } from '../../models/Song';

class SongService {
  private pool: Pool;
  private cacheService: CacheService;

  constructor(cacheService: CacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addSong({
    title, year, performer, genre, duration,
  }: SongRequest): Promise<string> {
    const id = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, createdAt],
    };

    const result = await this.pool.query<IdBased>(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    await this.cacheService.delete('songs');

    return result.rows[0].id;
  }

  async getSongs(): Promise<SimplifiedSong[]> {
    try {
      const result = await this.cacheService.get('songs');
      return JSON.parse(result) as SimplifiedSong[];
    } catch (error) {
      const result = await this.pool.query('SELECT id, title, performer FROM songs');
      const mappedResult = result.rows;
      await this.cacheService.set('songs', JSON.stringify(mappedResult));
      return mappedResult;
    }
  }

  async getSongById(id: string): Promise<Song> {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query<Song>(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows[0];
  }

  async editSongById(id: string, {
    title, year, performer, genre, duration,
  }: SongRequest): Promise<void> {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, "updatedAt" = $6 WHERE id = $7 RETURNING id',
      values: [title, year, performer, genre, duration, updatedAt, id],
    };

    const result = await this.pool.query<IdBased>(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }

    await this.cacheService.delete('songs');
  }

  async deleteSongById(id: string): Promise<void> {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query<IdBased>(query);

    if (!result.rowCount) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
    await this.cacheService.delete('songs');
  }
}

export default SongService;
