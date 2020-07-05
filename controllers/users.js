const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const {
  NotFoundError,
  BadRequesError,
  ConflictingRequestError,
} = require('../errors/errors-bundle');

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Нет пользователя с таким id'))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({
        name, about, avatar, email,
      });
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
        NODE_ENV === 'production' ? JWT_SECRET : 'secreWord',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
        .end();
    })
    .catch(next);
};

module.exports = {
  getUserById,
  login,
  createUser,
};
