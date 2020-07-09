const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const { jwtSecretKey } = require('../explorer.config');
const User = require('../models/user');
const {
  NotFoundError,
  BadRequesError,
  ConflictingRequestError,
} = require('../errors/error-handler');

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then((user) => {
      res.status(201).send({ _id: user._id, email, name });
    })
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError' || !password) {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      if (error.name === 'MongoError' && error.code === 11000) {
        return next(new ConflictingRequestError('Указанный email уже используется'));
      }
      return next(error);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredencials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : jwtSecretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

module.exports = {
  getUser,
  login,
  createUser,
};
