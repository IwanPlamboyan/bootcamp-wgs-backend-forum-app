import MainForum from '../models/MainForumModel.js';
import validator from 'validator';
import { Op } from 'sequelize';

export const getMainForum = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query || '';

  let result = [];
  if (last_id < 1) {
    const results = await MainForum.findAll({
      attributes: ['id', 'title', 'createdAt', 'updatedAt'],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + search + '%',
            },
          },
        ],
      },
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await MainForum.findAll({
      where: {
        id: {
          [Op.lt]: last_id,
        },
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + search + '%',
            },
          },
        ],
      },
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

export const getMainForumById = async (req, res) => {
  try {
    const response = await MainForum.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const tambahMainForum = async (req, res) => {
  const title = req.body.title.toLowerCase();
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    const duplikatTitleMainForum = await MainForum.findOne({
      where: { title: title },
    });

    if (duplikatTitleMainForum !== null) return res.status(422).json({ msg: 'Judul sudah ada' });

    await MainForum.create({ title });
    res.status(201).json({ msg: 'Main Forum berhasil dibuat' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateMainForum = async (req, res) => {
  const { oldTitle, newTitle } = req.body;
  if (validator.isEmpty(newTitle)) return res.status(204).json({ msg: 'Judul harus diisi' });

  try {
    if (oldTitle !== newTitle) {
      const duplikatMainForum = await MainForum.findOne({
        where: { title: newTitle.toLowerCase() },
      });

      if (duplikatMainForum !== null) return res.status(400).json({ msg: 'Judul sudah ada' });
    }

    await MainForum.create({ title });
    res.status(201).json({ msg: 'Main forum berhasil diupdate' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteMainForum = async (req, res) => {
  const mainForum = await MainForum.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!mainForum) return res.status(404).json({ msg: 'Data tidak ditemukan' });

  try {
    await MainForum.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Main Forum berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
