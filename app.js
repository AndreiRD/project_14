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

// Нужно исправить
// + 1. В случае, если в метод регистрации не передан пароль сервис возвращает ошибку
// со статус-кодом 500 вместо соответствущего данному кейсу 400й
// https://i.imgur.com/azhwCPf.png
// Это происходит из-за попытки расчета хэша от undefined.

// + 2. В случае если в метод авторизации не передан пароль сервис падает
// и клиент не получает ответ на запрос
// https://i.imgur.com/u67Mv0v.png
// https://i.imgur.com/zJG8XB9.png

// + 3. Удаление карточки не работает. В случае если в метод передан
// корректный идентификатор сервис возвращает ошибку со статус-кодом 401
// Это происходит потому что вместо самого идентификатора вы передаете
// в метод объект содержищащий его (а не строку)
// https://i.imgur.com/GCouuy7.png

// + 4. После исправления предыдущего пункта проявляется следующая проблема - при попытке удалить
// собственную карточку сервис возвращает ошибку со статус-кодом 403.
// Это происходи из-за того что вы пытаетесь сравнить
// объект приведенный к строке со строкой-идентификатором
// текущего авторизационного пользователя, которые будут всегда не равны.
// Для исправления скорректируйте условие.
// https://i.imgur.com/W6ed5Qj.png
// https://i.imgur.com/mlfcoi0.png

// + 5. В случае если в методе возникает исключение CastError - необходимо возвращать
// ошибку со статус-кодом 400, а не 401, поскольку данная
// ошибка это фактически ошибка валидации идентификатора.
