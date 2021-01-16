const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/user');
const { errHandler } = require('../middlewares/errhandler.js');

module.exports.getUserById = (req, res) => {
  if (validator.isMongoId(req.params.id.toString)) {
    User.findById(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: 'Пользователь не найден' });
        }
        return res.send({ data: user });
      })
      .catch((err) => errHandler(err));
  } else {
    res.status(400).send({ message: 'Передан некорректный ID' });
  }
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => errHandler(err));
};

module.exports.postUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (password && User.checkIfEmailAvailable(req.body.email)) {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => User.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(201).send({
        email: user.email, name: user.name, about: user.about, avatar: user.avatar,
      }))
      .catch((err) => errHandler(err));
  } else { res.status(409).send({ message: 'Пользователь с такой почтой уже есть' }); }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => errHandler(err));
};
