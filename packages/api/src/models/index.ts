import { Sequelize } from 'sequelize';
import { createSongModel } from './Song';

export function initiateModel(sequelize: Sequelize) {
  createSongModel(sequelize);
}