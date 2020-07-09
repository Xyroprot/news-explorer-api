const articles = require('express').Router();
const {
  celebrate, Joi, Segments,
} = require('celebrate');

const auth = require('../middlewares/auth');
const urlValidator = require('../validators/urlValidator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articles.get('/articles', celebrate({
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), auth, getArticles); // возвращает все сохранённые пользователем статьи

articles.post('/articles', celebrate({
  [Segments.BODY]: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    data: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().custom(urlValidator).required(),
    image: Joi.string().custom(urlValidator).required(),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), auth, createArticle); // создаёт статью с переданными в теле

articles.delete('/articles/:articleId', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    articleId: Joi.string().alphanum().length(24),
  }),
  [Segments.HEADERS]: Joi.object().keys({
    cookie: Joi.string().required(),
  }).unknown(true),
}), auth, deleteArticle); // удаляет сохранённую статью  по _id

module.exports = articles;
