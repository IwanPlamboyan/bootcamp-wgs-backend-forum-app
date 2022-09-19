import { Sequelize } from 'sequelize';

const db = new Sequelize('db_forum', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
});

export default db;
