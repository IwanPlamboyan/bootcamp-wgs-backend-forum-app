import Like from '../models/LikeModel.js';
import { Op } from 'sequelize';

export const getLikes = async (req, res) => {
  const { postId } = req.query;

  try {
    const response = await Like.findAll({
      where: {
        post_id: postId,
      },
      attributes: ['user_id'],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json(error.message);
  }
};

export const addLike = async (req, res) => {
  const { postId } = req.body;
  if (postId === undefined || postId === false) return res.status(400).json({ msg: 'postId harus di isi' });

  try {
    await Like.create({ post_id: postId, user_id: req.userId });
    res.status(201).json({ msg: 'Post telah disukai' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const deleteLike = async (req, res) => {
  const { postId } = req.params;

  try {
    await Like.destroy({
      where: {
        [Op.and]: [
          {
            user_id: req.userId,
          },
          {
            post_id: postId,
          },
        ],
      },
    });
    res.status(200).json({ msg: 'Post tidak disukai' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};
