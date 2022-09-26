import Users from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!user[0]) return res.status(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].id;
      const username = user[0].username;
      const email = user[0].email;
      const foto_profile = user[0].foto_profile;
      const roles = user[0].roles;
      const accessToken = jwt.sign({ userId, username, email, foto_profile, roles }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s',
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
