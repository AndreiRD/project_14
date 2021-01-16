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

// 1. Для самопроверки воспользуйтесь следующей командой npx eslint .
// + 2. Практика, при которой ошибка хардкодится в .catch-блоке является нежелательной и не допускается в финальных работах по бекенду в Яндекс.Практикуме.
// + Подобный подход приводит к тому, что вне зависимости от того какая ошибка произойдет она будет обработана одинаково и клиент всегда получит 500ю ошибку,
// + даже если фактически она неуместная
// +  3. Необходимо честно проверять тип ошибки по имени ошибки (значению поля name)
// + 4. В рамках данной проектно работы требуется обрабатывать ошибки валидации (ValidationError),
// + ошибки валидации идентификатора (CastError, для методов удаления карточки и запроса информации о пользователе по ID) возвращая
// + ошибку со статус-кодом 400 и текстом, отражающим суть проблемы
// + 5. API не должен возвращать хэш пароля в ответе метода регистрации
// + 6. В случае если в метод регистрации переданы некорректные данные (например не передано поле name)
// + сервис должен возвращать ошибку со статус-кодом 400 и текстом, отражающим место возникновения ошибки
// + (содержится в поле message объекта ошибки) https://i.imgur.com/ulfmO0W.png
// + 7. При попытке повторной регистрации пользователя на тот же адрес электронной почты сервис должен возвращать
// + ошибку со статус-кодом 409 (Conflict) и текстом ошибки отражающим ее причину (пользователь с данным email уже существует),
// + а не 500ю как это происходит сейчас https://i.imgur.com/tYUacvC.png
// + 8. Авторизация не работает - в случае если в метод передана корректная пара логин-пароль сервис
// + возвращает ошибку со статус-кодом 500 и текстом TypeError: User.findUserByCredentials is not a function https://i.imgur.com/8aeLaxk.png
//+  9. После исправления проблемы указанной выше авторизация также оказывается сломанной,
// + однако теперь сервис возвращает ошибку { "message": "bcrypt is not defined" } https://i.imgur.com/De9Jjci.png
// + Метод создания картички позволяет создать карточку с некорректной ссылкой.
// + 10. Убедитесь, что реализация на уровне модели данных реализована корректно https://i.imgur.com/un0UuEg.png
// + 11. Вслучае если в метод создания карточки передано некорректное имя карточки сервис возвращает ошибку
// + со статус-кодом 500 вместо соответствующей 400 (Bad Request), который соответствует ошибке валидации пользовательских данных
// + 12. Метод удаления карточки не рабоатет - в случае если передан корректный идентификатор карточки,
// + присутстивующей в БД сервис возвращает 500ю ошибку и не удаляет карточку https://i.imgur.com/vj89tlZ.png
// + 13. В случае если в метод получения информации о пользователе по ID передан корректный ID отсутствующий
// + в бд сервис падает. https://i.imgur.com/XWApQyd.png
// + Это происходит из-за попытки отправить ответ дважды - внутри блока if(...) {...} и сразу за ним.
// + Для того чтобы избежать этого добавьте остановку выполнения после возврата ошибки внутри блока if(...) {...} при помощи
// + return или оберните альтернативную ветку в else https://i.imgur.com/R362ACZ.png
