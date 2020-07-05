const users = require('express').Router();
const auth = require('../middlewares/auth');

const { createUser, login, getUser } = require('../controllers/users');

users.post('/signup', createUser); // создаёт пользователя с переданными в теле email, password и name
users.post('/signin', login); // проверяет переданные в теле почту и пароль и возвращает JWT
users.get('/users/me', auth, getUser); // возвращает информацию о пользователе (email и имя)

module.exports = users;
