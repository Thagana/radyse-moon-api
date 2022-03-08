import { Model, DataTypes, Optional } from "sequelize";
import db from "../../configs/db.connect";

interface TokenAttributes {
  id: number;
  user_id: number;
  token: string;
}

type TokenCreationAttributes = Optional<
TokenAttributes,
  "id"
>;

class Tokens
  extends Model<TokenAttributes, TokenCreationAttributes>
  implements TokenAttributes {
  public id!: number;

  public user_id!: number;

  public token!: string;;

  public readonly created_at!: Date;

}

Tokens.init(
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
    token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  },
  {
    tableName: "push_tokens",
    sequelize: db,
    timestamps: false
  }
);

export default Tokens;