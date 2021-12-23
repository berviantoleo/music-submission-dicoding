import { DataTypes, Model, Sequelize, Optional } from "sequelize";

export interface UserAttributes {
  id: string;
  username: string;
  fullname: string;
  password: string;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public fullname!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export function createUserModel(sequelize: Sequelize) {
  User.init({
    id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: "User",
    paranoid: true
  });
}