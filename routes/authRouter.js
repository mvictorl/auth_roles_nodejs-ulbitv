const router = require('express').Router()
const { check } = require('express-validator')
const authController = require('../controllers/authController')

router.post('/registration', [
  check('username', 'The name cannot be empty').trim().escape().notEmpty(),
  check('password', 'Password length must be between 4 and 10 characters').isLength({ min: 4, max: 10 })
], authController.registration)

router.post('/login', authController.login)

router.get('/users', authController.getUsers)

module.exports = router
