const User = require('../models/User')
const Role = require('../models/Role')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { secretKey } = require('../config')

function generateAccessToken(id, roles) {
  const payload = { id, roles }
  return jwt.sign(payload, secretKey, {expiresIn: "8h"})
}

class AuthController {
  // ************* REGISTRATION
  async registration(req, res) {
    try {
      const validationErrors = validationResult(req)
      if (!validationErrors.isEmpty()) {
        return res.status(400).json({ message: 'Validation error', validationErrors })
      }

      const { username, password } = req.body
      const candidate = await User.findOne({ username })
      if (candidate) {
        res.status(400).json({ message: 'Such Username already exist (in Controller)' })
      }

      const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5))
      const userRole = await Role.findOne({ value: 'USER' })
      const user = new User({ username, password: hashPassword, roles: [ userRole.value ] })

      await user.save()
      return res.json({ message: 'User created successfully' })

    } catch (e) {
      console.error(e)
      res.status(400).json({ message: 'Registration error (in Controller)' })
    }
  }

  // ************* LOGIN
  async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(400).json(`User "${ username }" not found`)
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password)
      if (!isPasswordValid) {
        return res.status(400).json(`Password is incorrect`)
      }

      const token = generateAccessToken(user._id, user.roles)
      return res.json({token})

    } catch (e) {
      console.error(e)
      res.status(400).json({ message: 'Login error (in Controller)' })
    }
  }

  // ************* GET USERS (for test purpose)
  async getUsers(req, res) {
    try {
      const users = await User.find()
      return res.json(users)
      /*** Manual creating two roles: ***/
      // const userRole = new Role()
      // const adminRole = new Role({ value: 'ADMIN' })
      // await userRole.save()Login      // await adminRole.save()
      // res.json({ message: 'Users created' })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = new AuthController()
