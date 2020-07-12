const validator = require('validator');

const { BadRequesError } = require('../errors/error-handler');

const urlValidator = (value) => {
  if (!validator.isURL(value)) {
    return new BadRequesError('Произошла ошибка при обработке запроса');
  }
  return value;
};

module.exports = urlValidator;
