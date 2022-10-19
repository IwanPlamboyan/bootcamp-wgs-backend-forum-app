import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';

export const Register = async (req, res) => {
  const { username, email, password, confirmPassword, roles } = req.body;

  if (validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password) || validator.isEmpty(confirmPassword)) return res.status(400).json({ msg: 'semua field harus diisi' });

  const splitUsername = username.split(' ');
  if (splitUsername[1] !== undefined) return res.status(400).json({ msg: 'Username tidak boleh ada spasi' });

  if (!validator.isEmail(email)) return res.status(400).json({ msg: 'Email tidak valid' });
  if (password.length < 6) return res.status(400).json({ msg: 'Password minimal harus 6 karakter' });
  if (password !== confirmPassword) return res.status(400).json({ msg: 'Password dan confirm Password tidak cocok' });

  if (!validator.equals(roles, 'user') && !validator.equals(roles, 'moderator') && !validator.equals(roles, 'admin')) return res.status(400).json({ msg: 'Roles tidak sesuai' });

  try {
    const duplikatEmail = await User.findOne({
      attributes: ['email'],
      where: { email: email },
    });

    if (duplikatEmail !== null) return res.status(400).json({ msg: 'Email sudah terdaftar, gunakan email yang lain' });

    const duplikatUsername = await User.findOne({
      attributes: ['username'],
      where: { username: username },
    });

    if (duplikatUsername !== null) return res.status(400).json({ msg: 'Username sudah digunakan, gunakan username yang lain' });

    // mengencyption password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      username: username,
      email: email,
      password: hashPassword,
      foto_profile: 'profile-default.jpg',
      image_url: `${req.protocol}://${req.get('host')}/img/foto_profile/profile-default.jpg`,
      roles: roles,
    });
    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error.message);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: 'Email atau Password salah' });

    const userId = user[0].id;
    const username = user[0].username;
    const email = user[0].email;
    const image_url = user[0].image_url;
    const roles = user[0].roles;

    const accessToken = jwt.sign({ userId, username, email, image_url, roles }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s',
    });
    const refreshToken = jwt.sign({ userId, username, email, image_url, roles }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    await User.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan' });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  if (!user) return res.sendStatus(204);

  const userId = user.id;

  await User.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  res.sendStatus(200);
};
