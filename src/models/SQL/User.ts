import { Model, DataTypes, Optional } from "sequelize";
import db from "../../configs/db.connect";

interface UserAttributes {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string
}

type UserCreationAttributes = Optional<
  UserAttributes,
  "id"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;

  public first_name!: string;

  public last_name!: string;

  public email!: string;

  public avatar!: string;

  public readonly created_at!: Date;

}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
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
      defaultValue: 'profile.png'
    },
  },
  {
    tableName: "users",
    sequelize: db,
    timestamps: false
  }
);

export default User;