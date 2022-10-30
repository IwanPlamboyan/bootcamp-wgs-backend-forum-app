import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const Log = db.define(
  'logs',
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    roles: {
      type: DataTypes.STRING,
    },
    client_ip: {
      type: DataTypes.STRING,
    },
    request_method: {
      type: DataTypes.STRING,
    },
    endpoint: {
      type: DataTypes.STRING,
    },
    status_code: {
      type: DataTypes.STRING,
    },
    content_length: {
      type: DataTypes.STRING,
    },
    response_time: {
      type: DataTypes.STRING,
    },
    timestamp: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

// (async () => {
//   await db.sync();
// })();

export default Log;
