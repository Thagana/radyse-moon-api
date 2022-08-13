import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

interface UserMetaAttributes {
  id: number;
  browser_name: string;
  browser_version: string;
  device_type: string;
  device_vendor: string;
  device_model: string;
  os_name: string;
  os_version: string;
  engine_name: string;
  cpu_architecture: string;
  user_id: string;
}

type UserMetaCreationAttributes = Optional<UserMetaAttributes, "id">;

class UserMeta
  extends Model<UserMetaAttributes, UserMetaCreationAttributes>
  implements UserMetaAttributes
{
  public id!: number;
  public browser_name!: string;
  public browser_version!: string;
  public device_type!: string;
  public device_vendor!: string;
  public device_model!: string;
  public os_name!: string;
  public os_version!: string;
  public cpu_architecture!: string;
  public user_id!: string;
  public engine_name!: string;
}

UserMeta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
    browser_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    browser_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_vendor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    os_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    os_version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    engine_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cpu_architecture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "user_meta",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
  }
);
