import SubForum from '../models/SubForumModel.js';
import User from '../models/UserModel.js';
import MainForum from '../models/MainForumModel.js';
import validator from 'validator';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

export const getSubForum = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query || '';

  let result = [];
  if (last_id < 1) {
    const results = await SubForum.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
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
          model: MainForum,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await SubForum.findAll({
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
          model: MainForum,
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

export const getSubForumById = async (req, res) => {
  try {
    const response = await SubForum.findOne({
      where: {
        id: req.params.id,
      },
      include: [{ model: User, attributes: ['username', 'foto_profile', 'image_url'] }],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getAllSubForumByMainId = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await SubForum.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
        main_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: MainForum,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await SubForum.findAll({
      attributes: ['id', 'title', 'body', 'createdAt', 'updatedAt'],
      where: {
        main_id: req.params.id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: MainForum,
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

export const getAllSubForumByUserId = async (req, res) => {
  const last_id = parseInt(req.query.last_id) || 0;
  const limit = parseInt(req.query.limit) || 20;

  let result = [];
  if (last_id < 1) {
    const results = await SubForum.findAll({
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
          model: MainForum,
          attributes: ['id', 'title'],
        },
      ],
      limit: limit,
      order: [['id', 'DESC']],
    });
    result = results;
  } else {
    const results = await SubForum.findAll({
      where: {
        user_id: req.params.user_id,
      },
      include: [
        {
          model: User,
          attributes: ['username', 'foto_profile', 'image_url'],
        },
        {
          model: MainForum,
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

export const tambahSubForum = async (req, res) => {
  const { title, body, main_id, user_id } = req.body;
  if (validator.isEmpty(title)) return res.status(400).json({ msg: 'Judul harus diisi' });
  if (validator.isEmpty(main_id)) return res.status(400).json({ msg: 'main_id harus diisi' });
  if (validator.isEmpty(user_id)) return res.status(400).json({ msg: 'user_id harus diisi' });

  if (req.files !== null) {
    const file = req.files.image;
    const ext = path.extname(file.name);
    const imageName = file.md5 + new Date().toLocaleTimeString() + ext;
    const imageURL = `${req.protocol}://${req.get('host')}/img/sub_forum/${imageName}`;
    const allowedType = ['.png', '.jpg', 'jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: 'Gambar tidak valid' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Gambar harus kurang dari 5 MB' });

    file.mv(`./public/img/sub_forum/${imageName}`, async (err) => {
      if (err) return res.status(500).json({ msg: err.message });
      try {
        await SubForum.create({
          title: title,
          body: body,
          image_name: imageName,
          image_url: imageURL,
          main_id: main_id,
          user_id: user_id,
        });
        res.status(201).json({ msg: 'Sub Forum berhasil ditambahkan' });
      } catch (error) {
        console.log(error.message);
      }
    });
  } else {
    try {
      await SubForum.create({ title, body, main_id, user_id });
      res.status(201).json({ msg: 'Sub Forum berhasil ditambahkan' });
    } catch (error) {
      console.log(error);
    }
  }
};

// belum kepake (opsional)
export const updateSubForum = async (req, res) => {
  const { title, body, main_id } = req.body;
  if (validator.isEmpty(title)) return res.status(204).json({ msg: 'Judul harus diisi' });
  if (validator.isEmpty(body)) return res.status(204).json({ msg: 'Sub Forum harus diisi' });

  const subForum = await SubForum.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!subForum) return res.status(404).json({ msg: 'No Data Found' });

  let imageName = '';
  let imageURL = '';

  if (req.files === null) {
    imageName = subForum.image_name;
  } else {
    const file = req.files.image;
    const ext = path.extname(file.name);
    imageName = file.md5 + new Date().toLocaleTimeString() + ext;
    imageURL = `${req.protocol}://${req.get('host')}/img/sub_forum/${imageName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: 'Invalid Image' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Image must be less than 5 MB' });

    const filePath = `./public/img/sub_forum/${subForum.image_name}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    file.mv(`./public/img/sub_forum/${imageName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  try {
    await SubForum.update(
      {
        title: title,
        body: body,
        image_name: imageName,
        image_url: imageURL,
        main_id: main_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'Sub Forum berhasil diUbah' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteSubForum = async (req, res) => {
  const { id } = req.params;
  const subForum = await SubForum.findOne({
    where: {
      id: id,
    },
  });

  if (!subForum) return res.status(404).json({ msg: 'Sub Forum tidak ditemukan' });
  try {
    if (subForum.image_name !== null) {
      const filePath = `./public/img/sub_forum/${subForum.image_name}`;
      fs.unlinkSync(filePath);
    }

    await SubForum.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ msg: 'Sub Forum berhasil dihapus' });
  } catch (error) {
    console.log(error.message);
  }
};
