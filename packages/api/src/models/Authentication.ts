import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface AuthenticationAttributes {
  id: number;
  token: string;
}

export type AuthenticationCreationAttributes = Optional<AuthenticationAttributes, "id">

export class Authentication extends Model<AuthenticationAttributes, AuthenticationCreationAttributes> implements AuthenticationAttributes {
  public id!: number;
  public token!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createAuthenticationModel(sequelize: Sequelize) {
  Authentication.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: "Authentications",
  });
}