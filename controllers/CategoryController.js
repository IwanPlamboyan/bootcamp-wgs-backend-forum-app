import Category from '../models/CategoryModel.js';
import validator from 'validator';
import { Op } from 'sequelize';
import Post from '../models/PostModel.js';

export const getCategory = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query || '';

  let result = [];
  if (last_id < 1) {
    const results = await Category.findAll({
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
    const results = await Category.findAll({
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

export const getAllCategory = async (req, res) => {
  try {
    const response = await Category.findAll({
      attributes: ['id', 'title'],
      order: [['id', 'DESC']],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const response = await Category.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const tambahCategory = async (req, res) => {
  const { title } = req.body;
  console.log(req.body);
  console.log(title);
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });

  const duplikatTitleCategory = await Category.findOne({
    where: { title: title },
  });

  if (duplikatTitleCategory !== null) return res.status(422).json({ msg: 'Judul sudah ada' });

  try {
    await Category.create({ title });
    res.status(201).json({ msg: 'Category berhasil dibuat' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateCategory = async (req, res) => {
  const { id, title } = req.body;
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi!' });

  const category = await Category.findOne({
    where: { id: id },
  });
  if (!category) return res.status(404).json({ msg: 'Data tidak ditemukan!' });

  const duplikatTitleCategory = await Category.findOne({
    where: { title: title },
  });
  if (duplikatTitleCategory) return res.status(400).json({ msg: 'Judul sudah ada!' });

  try {
    await Category.update(
      { title },
      {
        where: { id: id },
      }
    );
    res.status(201).json({ msg: 'Category berhasil diupdate' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ['id'],
    include: {
      model: Post,
      attributes: ['category_id'],
    },
  });

  if (!category) return res.status(404).json({ msg: 'Data tidak ditemukan' });
  if (category.posts.length > 0) return res.status(400).json({ msg: 'Data tidak bisa dihapus dikarenakan ada postingan user!' });

  try {
    await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'Category berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
