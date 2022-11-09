import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Like = db.define(
  'likes',
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

Like.belongsTo(User, { foreignKey: 'user_id' });

// (async () => {
//   await db.sync();
// })();

export default Like;
