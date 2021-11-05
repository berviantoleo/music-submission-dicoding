import { Sequelize } from 'sequelize';
import { initiateModel } from './models';

const sequelize = new Sequelize('postgres://postgres:devpass4444@localhost:5432/musicdicoding');

initiateModel(sequelize);

sequelize.sync();

export default sequelize;