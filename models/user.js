const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const { UnauthorizedError } = require('../errors/error-handler');

const userSchema = new mongoose.Schema({
  email: { // адрес электорнной почты
    type: String,
    validate: validator.isEmail,
    required: true,
    unique: true,
  },
  password: { // пароль пользователя
    type: String,
    select: false,
    required: true,
    minlength: 8,
  },
  name: { // имя пользователя
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
});

userSchema.statics.findUserByCredencials = function findUserByCredencials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
