const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;