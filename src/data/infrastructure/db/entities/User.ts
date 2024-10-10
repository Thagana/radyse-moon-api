import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  verificationToken: string;
  forgotPasswordToken: string;
  password: string;
  verified: number;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "verified" | "verificationToken" | "forgotPasswordToken">;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public avatar!: string;
  public password!: string;
  public verified!: number;
  public verificationToken!: string;
  public forgotPasswordToken!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://avatars.githubusercontent.com/u/68122202?s=400&u=4abc9827a8ca8b9c19b06b9c5c7643c87da51e10&v=4",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verified: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
    verificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgotPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: "users",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
  }
);

export default User;