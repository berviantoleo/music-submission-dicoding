import { Pool } from 'pg';
import { v7 as uuidv7 } from 'uuid';
import InvariantError from '../../exceptions/InvariantError';

class CollaborationsService {
  private pool: Pool;
  constructor() {
    this.pool = new Pool();
  }

  async addCollaboration(playlistId: string, userId: string): Promise<string> {
    const id = `collab-${uuidv7()}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId: string, userId: string): Promise<void> {
    const query = {
      text: 'DELETE FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2 RETURNING id',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  async verifyCollaborator(playlistId: string, userId: string): Promise<void> {
    const query = {
      text: 'SELECT * FROM collaborations WHERE "playlistId" = $1 AND "userId" = $2',
      values: [playlistId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

export default CollaborationsService;
