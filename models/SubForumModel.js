import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import MainForum from './MainForumModel.js';

const { DataTypes } = Sequelize;

const SubForum = db.define(
  'sub_forum',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    main_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    freezeTableName: true,
  }
);

// SubForum.belongsTo(MainForum, { foreignKey: 'main_id' });

// (async () => {
//   await db.sync();
// })();

export default SubForum;
