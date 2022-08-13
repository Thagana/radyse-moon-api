import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from '../../../../configs/db.configs';

export interface WeatherAttributes {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
}

type WeatherCreationAttributes = Optional<WeatherAttributes, "id">;

class WeatherLocation
  extends Model<WeatherAttributes, WeatherCreationAttributes>
  implements WeatherAttributes
{
  public id!: number;
  public latitude!: number;
  public longitude!: number;
  public user_id!: number;
}

WeatherLocation.init(
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
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  {
    tableName: "weather_location",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
  }
);

export default WeatherLocation;