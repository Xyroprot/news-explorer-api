const ConflictingRequestError = require('./conflicting-request-err');
const BadRequesError = require('./bad-request-err');
const UnauthorizedError = require('./unauthorized');
const ForbiddenError = require('./forbidden-err');
const NotFoundError = require('./not-found-err');

const pageNotFound = (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};

const centralizedErrorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err; // если у ошибки нет кода, то по умолчанию код "500"
  if (res.headersSent) {
    return next(err);
  }
  return res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Произошла ошибка при чтении данных' : message });
};

module.exports = {
  ConflictingRequestError,
  BadRequesError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  pageNotFound,
  centralizedErrorHandler,
};
