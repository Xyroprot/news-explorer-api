const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { errors } = require('celebrate');

dotenv.config();

const { users, articles } = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const { pageNotFound, centralizedErrorHandler } = require('./errors/error-handler');
const { mdbConnect } = require('./explorer.config');

const { PORT = 3000, NODE_ENV, MDB_CON } = process.env;
const app = express();

app.use(helmet()); // для установки заголовков, связанных с безопасностью
app.use(cookieParser());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect(NODE_ENV ? MDB_CON : mdbConnect, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(limiter); // ограничение числа запросов с одного IP в единицу времени
app.use(requestLogger); // логгер запросов

app.use('/', articles);
app.use('/', users);
app.use('*', pageNotFound);

app.use(errorLogger); // логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(centralizedErrorHandler); // централизованный обработчик ошибок

app.listen(PORT);
