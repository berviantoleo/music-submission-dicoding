export interface Song {
  id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration: number;
  insertedAt: Date;
  updatedAt: Date;
}