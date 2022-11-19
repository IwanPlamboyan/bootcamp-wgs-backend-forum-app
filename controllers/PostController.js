import Post from '../models/PostModel.js';
import User from '../models/UserModel.js';
import Category from '../models/CategoryModel.js';
import validator from 'validator';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';
import Comment from '../models/CommentModel.js';

export const getPosts = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query || '';

  let result = [];
  if (last_id < 1) {
    const results = await Post.findAll({
      attributes: ['id', 'title', 'image_url', 'createdAt', 'updatedAt'],
      where: {
        [Op.or]: [
          {
            title: {
              [Op.like]: '%' + search + '%',
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await Post.findAll({
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
          {
            body: {
              [Op.like]: '%' + search + '%',
            },
          },
        ],
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  }

  res.json({
    result: result,
    lastId: result.length ? result[result.length - 1].id : 0,
    hasMore: result.length >= limit ? true : false,
  });
};

export const getPostById = async (req, res) => {
  try {
    const response = await Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        { model: User, attributes: ['username', 'foto_profile', 'image_url'] },
        { model: Category, attributes: ['title'] },
      ],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllPostByCategoryId = async (req, res) => {
  const last_id = parseInt(req.query.lastId) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await Post.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
        category_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await Post.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
        category_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
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

export const getAllPostByUserId = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await Post.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
        user_id: req.params.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await Post.findAll({
      where: {
        user_id: req.params.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: Category,
          attributes: ['id', 'title'],
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

export const addPost = async (req, res) => {
  const { title, body, category_id, user_id } = req.body;
  if (validator.isEmpty(title)) return res.status(400).json({ msg: 'Judul harus diisi!' });
  if (validator.isEmpty(category_id)) return res.status(400).json({ msg: 'category_id harus diisi!' });
  if (validator.isEmpty(user_id)) return res.status(400).json({ msg: 'user_id harus diisi!' });
  if (validator.isEmpty(body)) return res.status(400).json({ msg: 'Deskripsi harus diisi!' });
  if (title.length >= 255) return res.status(400).json({ msg: 'Judul terlalu banyak!' });
  if (body.length >= 21000) return res.status(400).json({ msg: 'Teks deskripsi terlalu banyak!' });

  if (req.files !== null) {
    const file = req.files.image;
    const ext = path.extname(file.name);
    const imageName = file.md5 + new Date().toLocaleTimeString() + ext;
    const imageURL = `${req.protocol}://${req.get('host')}/img/posts/${imageName}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Format gambar harus png, jpg dan jpeg' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Gambar harus kurang dari 5 MB' });

    file.mv(`./public/img/posts/${imageName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await Post.create({
          title: title,
          body: body,
          image_name: imageName,
          image_url: imageURL,
          category_id: category_id,
          user_id: user_id,
        });
        res.status(201).json({ msg: 'Post berhasil ditambahkan' });
      } catch (error) {
        res.status(500).json({ msg: error.message });
      }
    });
  } else {
    try {
      await Post.create({ title, body, category_id, user_id });
      res.status(201).json({ msg: 'Post berhasil ditambahkan' });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: error.message });
    }
  }
};

export const updatePost = async (req, res) => {
  const { title, body, category_id } = req.body;
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });
  if (validator.isEmpty(body)) return res.status(204).json({ msg: 'Deskripsi harus diisi' });
  if (validator.isEmpty(category_id)) return res.status(400).json({ msg: 'Category_id harus diisi' });

  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
      attributes: ['username'],
    },
  });
  if (!post) return res.status(404).json({ msg: 'Data tidak ditemukan!' });
  if (post.user.username !== req.username) return res.status(400).json({ msg: 'Kamu tidak berhak mengedit postingan orang lain' });

  let imageName = '';
  let imageURL = '';

  if (req.files === null) {
    imageName = post.image_name;
    imageURL = post.image_url;
  } else {
    const file = req.files.image;
    const ext = path.extname(file.name);
    imageName = file.md5 + new Date().toLocaleTimeString() + ext;
    imageURL = `${req.protocol}://${req.get('host')}/img/posts/${imageName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: 'Format gambar harus png, jpg dan jpeg' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Gambar harus kurang dari 5 MB' });

    const filePath = `./public/img/posts/${post.image_name}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/img/posts/${imageName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  try {
    await Post.update(
      {
        title: title,
        body: body,
        image_name: imageName,
        image_url: imageURL,
        category_id: category_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'Post berhasil diUbah' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const editPostCategory = async (req, res) => {
  const { category_id } = req.body;
  if (validator.isEmpty(category_id)) return res.status(400).json({ msg: 'Category_id harus diisi' });

  const post = await Post.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!post) return res.status(404).json({ msg: 'Data tidak ditemukan!' });

  try {
    await Post.update(
      {
        category_id: category_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'Post Category berhasil diUbah' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findOne({
    where: {
      id: id,
    },
    attributes: ['id', 'image_name', 'user_id'],
    include: {
      model: User,
      attributes: ['username'],
    },
  });

  if (!post) return res.status(404).json({ msg: 'Post tidak ditemukan' });

  const role = req.roles;
  if (role === 'user' && post.user.username !== req.username) return res.status(400).json({ msg: 'Kamu tidak berhak menghapus postingan orang lain' });

  try {
    if (post.image_name !== null) {
      const filePath = `./public/img/posts/${post.image_name}`;
      fs.unlinkSync(filePath);
    }

    await Post.destroy({
      where: {
        id: id,
      },
      include: {
        model: Comment,
      },
    });
    res.status(200).json({ msg: 'Post berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: error.message });
  }
};
