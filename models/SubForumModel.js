import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const SubForum = db.define(
  'sub_forum',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    image_name: {
      type: DataTypes.STRING,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    main_id: {
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

SubForum.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(SubForum, { foreignKey: 'user_id' });

// (async () => {
//   await db.sync();
// })();

export default SubForum;
