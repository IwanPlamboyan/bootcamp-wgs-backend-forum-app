import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Category from './CategoryModel.js';
import Comment from './CommentModel.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Post = db.define(
  'posts',
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
    category_id: {
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

Post.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Post, { foreignKey: 'category_id' });
Post.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Post, { foreignKey: 'user_id' });
Post.hasMany(Comment, { foreignKey: 'post_id' });
Comment.belongsTo(Post, { foreignKey: 'post_id' });

// (async () => {
//   await db.sync();
// })();

export default Post;
