const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { UnauthorizedError } = require('../errors/error-handler');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secreWord');
  } catch {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
