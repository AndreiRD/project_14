const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');

const { postUser, login } = require('./controllers/users');
const router = require('./routes/users.js');
const cards = require('./routes/cards.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.post('/signup', postUser);
app.post('/signin', login);

app.use(auth);

app.use('/users', router);
app.use('/cards', cards);

app.use('/', (req, res) => res.status(404).send({ message: 'Запрашиваемый ресурс не найден' }));

app.listen(PORT, () => {});
