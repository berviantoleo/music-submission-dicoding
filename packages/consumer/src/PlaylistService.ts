import { Pool } from 'pg';
import { Songs } from './models/Songs';

class PlaylistService {

  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

  async getSongsfromPlaylist(playlistId: string): Promise<Songs[]> {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs
      LEFT JOIN songs ON songs.id = playlistsongs."songId"
      WHERE playlistsongs."playlistId" = $1`,
      values: [playlistId],
    };
    const result = await this.pool.query<Songs>(query);
    return result.rows;
  }
}

export default PlaylistService;
