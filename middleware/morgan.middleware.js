import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import Log from '../models/LogModel.js';

const stream = {
  write: async (message) => {
    const data = message.split(' ', 6);
    const user = JSON.parse(message.split(' ')[6]);

    try {
      await Log.create({
        username: user.length > 0 ? user[0] : '-',
        email: user.length > 0 ? user[1] : '-',
        roles: user.length > 0 ? user[2] : '-',
        client_ip: data[0],
        request_method: data[1],
        endpoint: data[2],
        status_code: data[3],
        content_length: data[4],
        response_time: data[5],
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

morgan.token('user', (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  const user = [];
  if (token) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      user.push(decoded.username, decoded.email, decoded.roles);
    });
  }
  return JSON.stringify(user);
});

const morganMiddleware = morgan(':remote-addr :method :url :status :res[content-length] :response-time :user', { stream, skip });

export default morganMiddleware;
