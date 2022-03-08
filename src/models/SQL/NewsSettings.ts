import { Model, DataTypes, Optional } from "sequelize";
import db from "../../configs/db.connect";

interface NewsSettingsAttributes {
  id: number;
  user_id: number;
  language: string;
  location: string;
  category: string;
  frequency: number;
  push_enabled: number;
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

  public category!: string;

  public frequency!: number;

  public push_enabled!: number;

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
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    frequency: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 3
    },
    push_enabled: {
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