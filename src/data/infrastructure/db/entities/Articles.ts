import { Model, DataTypes, Optional } from "sequelize";
import { Database } from "../index";
import config from "../../../../configs/db.configs";

export interface ArticleAttribute {
  id: string;
  source: string;
  image: string;
  description: string;
  dateCreated: string;
  publishedAt: string;
  author: string;
  title: string;
  location: string;
  category: string;
  url: string;
  urlToImage: string;
  country: string;
}

type ArticleCreationAttributes = Optional<ArticleAttribute, "id">;

class Article
  extends Model<ArticleAttribute, ArticleCreationAttributes>
  implements ArticleAttribute
{
  public id!: string;
  public source!: string;
  public image!: string;
  public description!: string;
  public dateCreated!: string;
  public publishedAt!: string;
  public author!: string;
  public title!: string;
  public location!: string;
  public category!: string;
  public url!: string;
  public urlToImage!: string;
  public country!: string;
}

Article.init(
  {
    id: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    source: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    publishedAt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dateCreated: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    urlToImage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: "articles",
    sequelize: new Database(config.DATABASE_URI).sequelize!,
    timestamps: false,
  }
);

export default Article;