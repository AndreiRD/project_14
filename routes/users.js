const router = require('express').Router();
const { getUserById, getUsers } = require('../controllers/users');

router.get('/:id', getUserById);

router.get('/', getUsers);

module.exports = router;
