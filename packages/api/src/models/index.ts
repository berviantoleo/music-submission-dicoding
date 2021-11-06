import { Sequelize } from 'sequelize';
import { createSongModel } from './Song';
import { createUserModel } from './User';
import { createAuthenticationModel } from './Authentication';

export function initiateModel(sequelize: Sequelize) {
  createSongModel(sequelize);
  createUserModel(sequelize);
  createAuthenticationModel(sequelize);
}