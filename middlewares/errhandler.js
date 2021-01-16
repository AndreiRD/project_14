module.exports.errorHandler = (err, res) => {
  switch (err.prototype.name) {
    case 'MongooseError':
      res.status(500).send({ message: 'Ошибка с базой данных' });
      break;
    case 'CastError':
      res.status(401).send({ message: 'Неправильный тип данных в запросе' });
      break;
    case 'DisconnectedError':
      res.status(500).send({ message: 'Сброшено подключение к базе данных' });
      break;
    case 'MissingSchemaError':
      res.status(404).send({ message: 'Запрошенная модель не найдена' });
      break;
    case 'DocumentNotFoundError':
      res.status(404).send({ message: 'Запрошенный документ не найден' });
      break;
    case 'ValidatorError':
      res.status(400).send({ message: 'Некорректные данные в запросе' });
      break;
    default:
      res.status(500).send({ message: err.message });
  }
};
