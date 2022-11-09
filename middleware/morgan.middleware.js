import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import Log from '../models/LogModel.js';
import User from '../models/UserModel.js';

const stream = {
  write: async (message) => {
    const data = message.split(' ', 6);
    const user = JSON.parse(message.split(' ')[6]);

    let day = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let month = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let timestamp = `${day[new Date().getDay()]}, ${new Date().getDate()} ${month[new Date().getMonth()]} ${new Date().getFullYear()}`;

    if (user.length > 0 && Object.hasOwn(user[0], 'refreshToken')) {
      try {
        const userDb = await User.findAll({
          where: {
            refresh_token: user[0].refreshToken,
          },
          attributes: ['username', 'email', 'roles'],
        });

        user.shift();
        if (userDb.length > 0) {
          user.push({ username: userDb[0].username, email: userDb[0].email, roles: userDb[0].roles });
        }
      } catch (error) {
        console.log(error);
      }
    }

    if ((data[2].split('?')[0] !== '/log' && data[2] !== '/token') || user[0]?.roles !== 'admin') {
      // try {
      //   await Log.create({
      //     username: user.length > 0 ? user[0].username : '-',
      //     email: user.length > 0 ? user[0].email : '-',
      //     roles: user.length > 0 ? user[0].roles : '-',
      //     client_ip: data[0],
      //     request_method: data[1],
      //     endpoint: data[2],
      //     status_code: data[3],
      //     content_length: data[4],
      //     response_time: data[5],
      //     timestamp: timestamp,
      //   });
      // } catch (error) {
      //   console.log(error.message);
      // }
    }
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

morgan.token('user', (req) => {
  const cookieToken = req.cookies.refreshToken;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const dataUser = [];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      dataUser.push({ username: decoded.username, email: decoded.email, roles: decoded.roles });
    });
  } else if (cookieToken !== undefined) {
    dataUser.push({ refreshToken: cookieToken });
  }

  return JSON.stringify(dataUser);
});

const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] :response-time :user', { stream, skip });

export default morganMiddleware;
