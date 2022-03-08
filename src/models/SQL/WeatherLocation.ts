import { Model, DataTypes, Optional } from "sequelize";
import db from "../../configs/db.connect";

interface WeatherLocationAttributes {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
}

type WeatherLocationCreationAttributes = Optional<
WeatherLocationAttributes,
  "id"
>;

class WeatherLocation
  extends Model<WeatherLocationAttributes, WeatherLocationCreationAttributes>
  implements WeatherLocationAttributes {
  public id!: number;

  public user_id!: number;

  public latitude!: number;;

  public longitude!: number;

  public readonly created_at!: Date;

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
    latitude: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    longitude: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "weather_location",
    sequelize: db,
    timestamps: false
  }
);

export default WeatherLocation;