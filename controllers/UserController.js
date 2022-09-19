import validator from 'validator';
import Users from '../models/UserModel.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.page || '';
  const offset = limit * page;
  const totalRows = await Users.count({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await Users.findAll({
    where: {
      [Op.or]: [
        {
          username: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    attributes: ['id', 'username', 'fullname', 'email', 'roles', 'createdAt', 'updatedAt'],
    offset: offset,
    limit: limit,
  });

  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getUserById = async (req, res) => {
  try {
    const response = await Users.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ['id', 'username', 'fullname', 'email', 'foto_profile', 'description'],
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const editprofile = async (req, res) => {
  const { oldUsername, newUsername, fullname, description } = req.body;

  if (validator.isEmpty(username)) return res.status(400).json({ msg: 'Username harus diisi' });
  const duplikatUsername = await Users.findOne({
    attributes: ['username'],
    where: { username: username },
  });

  if (duplikatUsername !== null && oldUsername !== newUsername) return res.status(400).json({ msg: 'Username sudah digunakan, gunakan username yang lain' });

  const user = await Users.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: 'user tidak ditemukan' });

  let fileName = '';
  if (req.files === null) {
    fileName = user.foto_profile;
  } else {
    const file = req.files.file;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLocaleLowerCase())) return res.status(422).json({ msg: 'Ini bukan gambar' });

    const fileSize = file.data.length;
    if (fileSize > 5000000) return res.status(422).json({ msg: 'Gambar harus kurang dari 5MB' });

    const filePath = `./public/img/foto_profile/${user.image}`;
    fs.unlinkSync(filePath);

    file.mv(`./public/img/foto_profile/${fileName}`, (err) => {
      if (err) return res.status(500).json({ msg: err.message });
    });
  }

  try {
    await Product.update(
      { username: username, fullname: fullname, foto_profile: fileName, description: description },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'Data Profile berhasil di ubah' });
  } catch (error) {
    console.log(error.message);
  }
};

export const createModerator = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(confirmPassword)) return res.status(400).json({ msg: 'semua field harus diisi' });

  if (!validator.isEmail(email)) return res.status(400).json({ msg: 'Email tidak valid' });

  if (password !== confirmPassword) return res.status(400).json({ msg: 'Password dan confirm Password tidak cocok' });

  try {
    const duplikatEmail = await Users.findOne({
      attributes: ['email'],
      where: { email: email },
    });

    if (duplikatEmail !== null) return res.status(400).json({ msg: 'Email sudah terdaftar, gunakan email yang lain' });

    const duplikatUsername = await Users.findOne({
      attributes: ['username'],
      where: { username: username },
    });

    if (duplikatUsername !== null) return res.status(400).json({ msg: 'Username sudah digunakan, gunakan username yang lain' });

    // mengencyption password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await Users.create({
      username: username,
      email: email,
      password: hashPassword,
      roles: 'moderator',
    });
    res.json({ msg: 'Moderator berhasil ditambahkan' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateModerator = async (req, res) => {
  const { roles } = req.body;

  if (validator.isEmpty(roles)) return res.status(422).json({ msg: 'Roles harus di isi' });
  if (!validator.equals(roles, 'moderator') && !validator.equals(roles, 'user')) return res.status(422).json({ msg: 'Roles harus harus sesuai' });

  try {
    await Users.update(
      { roles },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ msg: 'Roles moderator berhasil di ubah' });
  } catch (error) {
    console.log(error.message);
  }
};
