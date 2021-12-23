import { Sequelize } from 'sequelize';
import { initiateModel } from './models';

const sequelize = new Sequelize(process.env.DATABASE_URL || '');

initiateModel(sequelize);

export default sequelize;