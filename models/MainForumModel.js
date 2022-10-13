import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import SubForum from './SubForumModel.js';

const { DataTypes } = Sequelize;

const MainForum = db.define(
  'main_forum',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

SubForum.belongsTo(MainForum, { foreignKey: 'main_id' });
MainForum.hasMany(SubForum, { foreignKey: 'main_id' });

// (async () => {
//   await db.sync();
// })();

export default MainForum;
