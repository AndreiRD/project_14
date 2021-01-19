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
// + 1. В случае, если для удаления карточки недостаточно прав необходимо
// возвращать ошибку со статус-кодом 403 (Forbidden)
//
// + 2. В случае, если в метод регистрации
// не передан пароль сервис возвращает ошибку
// со статус-кодол 409 (Conflict),
// вместо 400 (Bad Request) хотя в данном случае он применим
// только тогда когда пользователь с данным email уже зарегистрирован.
// Это происходит потому, что в условии проверки наличия
// пользователя есть лишнее подусловие по полю пароль
//
// + 3. Регистрация сломнана - вне зависимости от того, существует
// ли пользователь с переданным в теле запроса email
// - сервис возвращает ошибку со статус-кодом 409.
// Это происходит потому,что в методе захардкожен результат операции
// как false и результат операции find фактически не проверяется
// https://i.imgur.com/dXAZg8C.png
//
// + 4. В случае возникновения исключения в любом из методов
// сервис падает с ошибкой TypeError:
// errHandler is not a function
// Обратите внимание на именование метода https://i.imgur.com/8Yptswg.png
// Также рекомендую рассмотреть вариант экспорта функции в module.exports (без ключа),
// поскольку в модуле errhandler.js экспортируется единственный метода
//
// + 5. После исправления ошибки предыдущего пункта всплывает
// следующая - в случае выброса исключения
// (например при попытке авторизации с парой логин-пароль,
// отсутствующей в БД) сервис падает со следующей ошибкой
// TypeError: Cannot read property 'name' of undefined
// https://i.imgur.com/c1MZaga.png
//
// + 6. Также обратите внимание, что в текущей реализации
// переменная res мидлвары errorHandler оказывается не задана,
// из-за чего после исправления ошибки предыдущего пункта в
// случае возникновения ошибки сервис начинает падать со следующей
// TypeError: Cannot read property 'status' of undefined
//
// + 7. В случае возникновения ошибки валидации (ValidationError)
// сервис возвращает 500ю ошибку вместо соответствующей 400й.
// Обратите внимание на имя ошибки в case - https://i.imgur.com/sWBFnHJ.png
//
// Дальнейшие комментарии приводятся с учетом того, что пункты,
// касающиеся error handler'а исправлены (иначе отсутствует возможность их проверить)
//
// + 9. В случае если в метод авторизации передана пара логин-пароль
// отсутствующая в БД сервис возвращает ошибку со статус-кодом 500 вместо
// соответствующего данной ситуации 401 (Unauthorized)
// https://i.imgur.com/9r6qCSH.png
//
// + 10. Удаление карточки не работает. При попытке удалить карточку
// с корректным ID сервис возвращает ошибку
// - TypeError: Expected a string but received a function
//
// https://i.imgur.com/fApJ4lw.png
//
// 11. После исправления ошибки предыдущего пункта при попытке удаления
// собственной карточки сервис возвращает ошибку "Карточка вам не принадлежит".
// Проверьте содержимое полей card.owner и req.user._id и скорректируйте проверку
//
// 12. Запрос информации о пользователе по его ID не работает
// и завершается следующей ошибкой TypeError: Expected a string but received a function
// https://i.imgur.com/TCfBVy6.png
