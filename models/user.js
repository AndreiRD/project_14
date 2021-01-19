const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const ApiError = require('../middlewares/apierror');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Некорректная ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Некорректный е-мейл',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findCredentials(email, password, res) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new ApiError('Неправильные почта или пароль')); }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ApiError('Неправильные почта или пароль'));
          }
          return user;
        })
        .catch(() => res.status(401).send({ message: 'Неправильная почта или пароль' }));
    })
    .catch(() => res.status(401).send({ message: 'Неправильная почта или пароль' }));
};

module.exports = mongoose.model('user', userSchema);
