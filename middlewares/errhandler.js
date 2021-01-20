module.exports.errHandler = (err) => {
  let message;
  let statusCode;
  const name = err && err.name;
  switch (name) {
    case 'MongoError':
      if (err.code === 11000) {
        statusCode = 409;
        message = 'Запись с такими данными уже существует';
        return [statusCode, message];
      }
      statusCode = 500;
      message = 'Ошибка с базой данных';
      return [statusCode, message];
    case 'MongooseError':
      statusCode = 500;
      message = 'Ошибка с базой данных';
      return [statusCode, message];
    case 'CastError':
      statusCode = 400;
      message = 'Неправильный тип данных в запросе';
      return [statusCode, message];
    case 'DisconnectedError':
      statusCode = 500;
      message = 'Сброшено подключение к базе данных';
      return [statusCode, message];
    case 'MissingSchemaError':
      statusCode = 404;
      message = 'Запрошенная модель не найдена';
      return [statusCode, message];
    case 'DocumentNotFoundError':
      statusCode = 404;
      message = 'Запрошенный документ не найден';
      return [statusCode, message];
    case 'ValidationError':
      statusCode = 400;
      message = 'Некорректные данные в запросе';
      return [statusCode, message];
    default:
      statusCode = 500;
      message = err.message || 'Произошла ошибка сервера';
      return [statusCode, message];
  }
};
