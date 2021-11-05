import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface SongAttributes {
  id: string;
  title: string;
  year: number;
  performer: string;
  genre: string;
  duration: number;
}

export type SongCreationAttributes = Optional<SongAttributes, "id">

export class Song extends Model<SongAttributes, SongCreationAttributes> implements SongAttributes {
  public id!: string;
  public title!: string;
  public year!: number;
  public performer!: string;
  public genre!: string;
  public duration!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createSongModel(sequelize: Sequelize) {
  Song.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    performer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: "Song",
    paranoid: true
  });

  return Song;
}