import { Pool } from "pg";

const pool = new Pool();

const cleanUp = async (): Promise<void> => {
  await pool.query("DELETE FROM playlistsongs");
  await pool.query("DELETE FROM songs");
};

export { cleanUp };
