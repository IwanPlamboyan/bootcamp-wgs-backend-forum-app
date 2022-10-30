import Comment from '../models/CommentModel.js';
import validator from 'validator';
import User from '../models/UserModel.js';

export const getCommentsByPostId = async (req, res) => {
  const postId = req.query.post_id;
  if (postId === '' || typeof postId == 'undefined' || !validator.isInt(postId)) return res.status(422).json({ msg: 'post_id harus di isi dengan angka' });
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const offset = limit * page;

  const totalRows = await Comment.count({
    where: {
      post_id: parseInt(postId),
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Comment.findAll({
    where: {
      post_id: parseInt(postId),
    },
    include: [
      {
        model: User,
        attributes: ['username', 'image_url'],
      },
    ],
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']],
  });

  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const tambahComment = async (req, res) => {
  const { name, post_id, user_id } = req.body;
  if (validator.isEmpty(name)) return res.status(400).json({ msg: 'field harus di isi' });
  if (post_id === undefined || post_id === false) return res.status(400).json({ msg: 'post_id harus di isi' });
  if (user_id === undefined || user_id === false) return res.status(400).json({ msg: 'user_id harus di isi' });
  if (name.length >= 1234) return res.status(400).json({ msg: 'Comment terlalu banyak!' });

  try {
    await Comment.create({ name: name, post_id: post_id, user_id: user_id });
    res.status(201).json({ msg: 'Diskusi berhasil ditambahkan' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const comment = await Comment.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: User,
        attributes: ['email'],
      },
    ],
  });

  if (!comment) return res.status(404).json({ msg: 'Diskusi tidak ditemukan' });

  if (req.roles === 'user' && req.email !== comment.user.email) res.status(422).json({ msg: 'Kamu tidak berhak menghapus komentar user lain' });

  try {
    await Comment.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ msg: 'Diskusi berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
