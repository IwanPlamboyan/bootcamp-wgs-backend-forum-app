import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Post from './PostModel.js';

const { DataTypes } = Sequelize;

const Category = db.define(
  'categories',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Post.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Post, { foreignKey: 'category_id' });

// (async () => {
//   await db.sync();
// })();

export default Category;
