const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const { users, articles } = require('./routes/index');
const auth = require('./middlewares/auth');

/*
const { requestLogger, errorLogger } = require('./middlewares/logger');
*/

const { pageNotFound, centralizedErrorHandler } = require('./errors/error-handler');

const { PORT = 3000, NODE_ENV } = process.env;
const app = express();

app.use(cookieParser());
app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', auth, articles);
app.use('/', auth, users);
app.use('*', pageNotFound);

app.use(centralizedErrorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}, ${NODE_ENV}`);
});
