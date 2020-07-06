const users = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');

const auth = require('../middlewares/auth');
const { createUser, login, getUser } = require('../controllers/users');

users.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser); // создаёт пользователя с переданными в теле email, password и name

users.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login); // проверяет переданные в теле почту и пароль и возвращает JWT

users.get('/users/me', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), auth, getUser); // возвращает информацию о пользователе (email и имя)

module.exports = users;
