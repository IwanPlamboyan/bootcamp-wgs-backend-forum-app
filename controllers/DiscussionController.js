import Discussion from '../models/DiscussionModel.js';
import { Op } from 'sequelize';
import validator from 'validator';
import path from 'path';
import fs from 'fs';
import Users from '../models/UserModel.js';

export const getDiscussionBySubForum = async (req, res) => {
  const subId = req.query.sub_id;
  if (subId === '' || typeof subId == 'undefined' || !validator.isInt(subId)) return res.status(422).json({ msg: 'sub_id harus di isi dengan angka' });
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await Discussion.findAll({
      where: {
        sub_id: parseInt(subId),
      },
      include: [
        {
          model: Users,
          attributes: ['username'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await Discussion.findAll({
      where: {
        sub_id: parseInt(subId),
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
          model: Users,
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

export const tambahDiscussion = async (req, res) => {
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

    file.mv(`./public/img/discussion/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Discussion.create({ name: name, image: fileName, sub_id: sub_id });
        res.status(201).json({ msg: 'Diskusi berhasil ditambahkan' });
      } catch (error) {
        console.log(error.message);
      }
    });
  } else {
    try {
      await Discussion.create({ name, sub_id });
      res.status(201).json({ msg: 'Diskusi berhasil ditambahkan' });
    } catch (error) {
      console.log(error);
    }
  }
};

export const deleteDiscussion = async (req, res) => {
  const { id } = req.params;
  const discussion = await Discussion.findOne({
    where: {
      id: id,
    },
    include: [
      {
        model: Users,
        attributes: ['email'],
      },
    ],
  });

  if (!discussion) return res.status(404).json({ msg: 'Diskusi tidak ditemukan' });

  if (req.roles === 'user' && req.email !== discussion.user.email) res.status(422).json({ msg: 'Diskusi ini tidak bisa dihapus oleh user lain' });

  try {
    if (!discussion.image === null) {
      const filePath = `./public/img/discussion/${discussion.image}`;
      fs.unlinkSync(filePath);
    }

    await Discussion.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ msg: 'Diskusi berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
