const mongoose = require('mongoose');
const validator = require('validator');

const articleSchema = new mongoose.Schema({
  keyword: { // ключевое слово, по которому статью нашли
    type: String,
    required: true,
  },
  title: { // заголовок статьи
    type: String,
    required: true,
  },
  text: { // текст статьи
    type: String,
    required: true,
  },
  data: { // дата статьи
    type: String,
    required: true,
  },
  source: { // источник статьи
    type: String,
    required: true,
  },
  link: { // ссылка на статью
    type: String,
    validate: validator.isURL,
    required: true,
  },
  image: { // ссылка на иллюстрацию к статье
    type: String,
    validate: validator.isURL,
    required: true,
  },
  owner: { // _id пользователя, сохранившего статью
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
