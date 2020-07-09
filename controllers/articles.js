const Article = require('../models/article');
const {
  NotFoundError, BadRequesError, ForbiddenError,
} = require('../errors/error-handler');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .orFail(new NotFoundError('Статьи не найдены'))
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send({ data: article }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new NotFoundError('Нет статьи с таким id'))
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Это не ваша статья');
      }
      return article.remove();
    })
    .then((article) => res.send({ data: article }))
    .catch((error) => {
      if (error.name === 'ValidationError' || error.name === 'CastError') {
        return next(new BadRequesError('Произошла ошибка при обработке запроса'));
      }
      return next(error);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
