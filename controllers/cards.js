const Cards = require('../models/card');
const validator = require('validator');
const { errHandler } = require('../middlewares/errhandler.js');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => errHandler(err));
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  Cards.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => errHandler(err));
};

module.exports.deleteCard = (req, res) => {
  if (validator.isMongoId(req.params.id.toString)) {
  Cards.findById(req.params.id).populate('owner')
    .then((card) => {
      if (!card) {
        res.status(404).json({ message: 'Карта не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        res.status(401).send({ message: 'Карточка вам не принадлежит' });
        return false;
      }
      Cards.findByIdAndRemove(req.params.id)
        .then((obj) => res.send({ data: obj }))
        .catch((err) => errHandler(err));
    })
    .catch(() => res.status(err.statusCode).send({ message: err.message }));
  }
  else {res.status(400).send({message: "Передан некорректный ID"})};
};
