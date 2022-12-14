import jwt from 'jsonwebtoken';

export const isUser = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.email = decoded.email;
    req.roles = decoded.roles;

    next();
  });
};

export const isModerator = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.email = decoded.email;
    req.roles = decoded.roles;

    if (decoded.roles === 'user') return res.status(404).json({ msg: 'hanya moderator dan admin yang bisa mengakses ini' });

    next();
  });
};

export const isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.email = decoded.email;
    req.roles = decoded.roles;

    if (decoded.roles !== 'admin') return res.status(404).json({ msg: 'ini hanya untuk admin' });

    next();
  });
};
