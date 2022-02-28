import { Model, DataTypes, Optional } from "sequelize";
import db from "../configs/db.connect";

interface NewsSettingsAttributes {
  id: number;
  user_id: number;
  language: string;
  location: string;
  frequency: number;
}

type NewsSettingsCreationAttributes = Optional<
NewsSettingsAttributes,
  "id"
>;

class NewsSettings
  extends Model<NewsSettingsAttributes, NewsSettingsCreationAttributes>
  implements NewsSettingsAttributes {
  public id!: number;

  public user_id!: number;

  public language!: string;;

  public location!: string;

  public frequency!: number;

  public readonly created_at!: Date;

}

NewsSettings.init(
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
    language: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 3
    },
  },
  {
    tableName: "news_settings",
    sequelize: db,
    timestamps: false
  }
);

export default NewsSettings;