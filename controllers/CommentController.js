import Comment from '../models/CommentModel.js';
import { Op } from 'sequelize';
import validator from 'validator';
import path from 'path';
import fs from 'fs';
import User from '../models/UserModel.js';

export const getCommentByPost = async (req, res) => {
  const postId = req.query.post_id;
  if (postId === '' || typeof postId == 'undefined' || !validator.isInt(postId)) return res.status(422).json({ msg: 'post_id harus di isi dengan angka' });
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await Comment.findAll({
      where: {
        post_id: parseInt(postId),
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await Comment.findAll({
      where: {
        post_id: parseInt(postId),
        [Op.and]: [
          {
            id: {
              [Op.lt]: last_id,
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  }

  res.json({
    result: result,
    last_id: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
  });
};

export const tambahComment = async (req, res) => {
  const { name, sub_id } = req.body;
  if (validator.isEmpty(name)) return res.status(400).json({ msg: 'field harus di isi' });

  if (!req.files === null) {
    const file = req.files.file;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Gambar tidak valid' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Gambar harus kurang dari 5 MB' });

    file.mv(`./public/img/comments/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Comment.create({ name: name, image: fileName, sub_id: sub_id });
        res.status(201).json({ msg: 'Diskusi berhasil ditambahkan' });
      } catch (error) {
        console.log(error.message);
      }
    });
  } else {
    try {
      await Comment.create({ name, sub_id });
      res.status(201).json({ msg: 'Diskusi berhasil ditambahkan' });
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
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

  if (req.roles === 'user' && req.email !== comment.user.email) res.status(422).json({ msg: 'Diskusi ini tidak bisa dihapus oleh user lain' });

  try {
    if (!comment.image === null) {
      const filePath = `./public/img/comments/${comment.image}`;
      fs.unlinkSync(filePath);
    }

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
