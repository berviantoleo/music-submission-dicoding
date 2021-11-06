import { ModelCtor, Sequelize } from 'sequelize';
import InvariantError from '../../exceptions/InvariantError';
import { Authentication } from '../../models/Authentication';

class AuthenticationsService {

  private db: ModelCtor<Authentication>;
  constructor(sequelize: Sequelize) {
    this.db = sequelize.models.Authentication as ModelCtor<Authentication>;
  }

  async addRefreshToken(token: string): Promise<void> {
    await this.db.create({
      token
    });
  }

  async verifyRefreshToken(token: string): Promise<void> {
    const result = await this.db.count({
      where: {
        token
      }
    });

    if (!result) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.verifyRefreshToken(token);
    await this.db.destroy({
      where: {
        token
      }
    });
  }
}

export default AuthenticationsService;
