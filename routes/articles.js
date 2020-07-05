const articles = require('express').Router();

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

articles.get('/articles', getArticles); // возвращает все сохранённые пользователем статьи
articles.post('/articles', createArticle); // создаёт статью с переданными в теле
articles.delete('/articles/articleId', deleteArticle); // удаляет сохранённую статью  по _id

module.exports = articles;
