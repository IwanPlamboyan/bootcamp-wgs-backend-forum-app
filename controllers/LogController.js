import Log from '../models/LogModel.js';
import { Op } from 'sequelize';

export const getLog = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 20;
  const search = req.query.search_query || '';
  const offset = limit * page;

  const totalRows = await Log.count({
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
  const result = await Log.findAll({
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
        {
          roles: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          client_ip: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          request_method: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          endpoint: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          status_code: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          timestamp: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [['id', 'DESC']],
  });

  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
