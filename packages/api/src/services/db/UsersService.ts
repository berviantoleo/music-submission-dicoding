import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import { ModelCtor, Sequelize } from 'sequelize';
import InvariantError from '../../exceptions/InvariantError';
import NotFoundError from '../../exceptions/NotFoundError';
import AuthenticationError from '../../exceptions/AuthenticationError';
import { UserCreationRequest } from '../../models/requests/UserCreationRequest';
import { User } from '../../models/User';

class UsersService {
  private db: ModelCtor<User>;
  private sequelize: Sequelize;

  constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
    this.db = sequelize.models.User as ModelCtor<User>;
  }

  async addUser({ username, password, fullname }: UserCreationRequest): Promise<string> {

    try {
      await this.verifyNewUsername(username);
      const result = this.sequelize.transaction(async (transaction) => {
        const id = `user-${nanoid(16)}`;
        const hashedPassword = await argon2.hash(password);

        const createdUser = await this.db.create({
          id, username, password: hashedPassword,
          fullname
        }, { transaction });
        return createdUser.id;
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new InvariantError('User gagal ditambahkan');
    }
  }

  async verifyNewUsername(username: string): Promise<void> {
    const resultCount = await this.db.count({
      where: {
        username
      }
    });

    if (resultCount) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async getUserById(userId: string): Promise<User> {
    const result = await this.db.findByPk(userId,
      {
        attributes: {
          exclude: ['password']
        }
      });
    if (result === null) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result;
  }

  async verifyUserCredential(username: string, password: string): Promise<string> {
    const result = await this.db.findAll({
      where: {
        username
      },
      attributes: ['id', 'password']
    });

    if (!result.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hashedPassword } = result[0];
    const match = await argon2.verify(hashedPassword, password);
    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }
}

export default UsersService;
