import { nanoid } from 'nanoid';
import { ModelCtor, Sequelize } from 'sequelize';

import NotFoundError from '../../exceptions/NotFoundError';
import InvariantError from '../../exceptions/InvariantError';
import CacheService from '../redis/CacheService';
import { SongRequest } from '../../models/requests/SongRequest';
import { IdBased } from '../../models/IdBased';
import { SimplifiedSong } from '../../models/SimplifiedSong';
import { Song } from '../../models/Song';


class SongService {
  private db: ModelCtor<Song>;
  private sequelize: Sequelize;
  private cacheService: CacheService;

  constructor(cacheService: CacheService, sequelize: Sequelize) {
    this.db = sequelize.models.Song as ModelCtor<Song>;
    this.cacheService = cacheService;
    this.sequelize = sequelize;
  }

  async addSong({
    title, year, performer, genre, duration,
  }: SongRequest): Promise<string> {
    try {
      const result = await this.sequelize.transaction(async transaction => {
        const id = `song-${nanoid(16)}`;
        const createdSong = await this.db.create({
          id,
          title,
          year,
          performer,
          genre,
          duration
        }, { transaction });
        await this.cacheService.delete('songs');
        return createdSong.id;
      });
      return result;
    } catch (error) {
      console.error(error);
      throw new InvariantError("Lagu gagal ditambahkan");
    }
  }

  async getSongs(): Promise<SimplifiedSong[]> {
    try {
      const result = await this.cacheService.get('songs');
      return JSON.parse(result) as SimplifiedSong[];
    } catch (error) {
      const result = await this.db.findAll();
      await this.cacheService.set('songs', JSON.stringify(result));
      return result;
    }
  }

  async getSongById(id: string): Promise<Song> {
    const result = await this.db.findByPk(id);
    if (result == null) {
      throw new InvariantError("Lagu tidak ditemukan");
    }
    return result;
  }

  async editSongById(id: string, {
    title, year, performer, genre, duration,
  }: SongRequest): Promise<void> {
    try {
      await this.sequelize.transaction(async transaction => {
        const updated = await this.db.update({
          title,
          year,
          performer,
          genre,
          duration
        }, {
          where: {
            id
          },
          returning: true,
          transaction
        });

        if (!updated[0]) {
          throw new InvariantError("Lagu tidak ditemukan");
        }

        await this.cacheService.delete('songs');
      });
    } catch (error) {
      console.log(error);
      if (error instanceof InvariantError) {
        throw error;
      } else {
        throw new InvariantError("Lagu tidak berhasil diupdate");
      }
    }
  }

  async deleteSongById(id: string): Promise<void> {
    try {
      await this.sequelize.transaction(async transaction => {

        const result = await this.db.destroy({
          where: {
            id
          },
          transaction,
        });

        if (!result) {
          throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
        }
        await this.cacheService.delete('songs');
      });
    } catch (error) {
      console.log(error);
      if (error instanceof InvariantError) {
        throw error;
      } else {
        throw new InvariantError("Lagu tidak berhasil diupdate");
      }
    }
  }
}

export default SongService;
