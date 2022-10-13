import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Discussion = db.define(
  'discussion',
  {
    name: {
      type: DataTypes.STRING,
    },
    image: {
      type: DataTypes.STRING,
    },
    sub_id: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

Discussion.belongsTo(User, { foreignKey: 'user_id' });

// (async () => {
//   await db.sync();
// })();

export default Discussion;
