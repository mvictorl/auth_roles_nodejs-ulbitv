const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') next()

  try {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) {
      return res.status(403).json({ message: 'Not authorized user' })
    }
    // Put into request 'user' object with payload (user ID & roles) from JWT
    req.user = jwt.verify(token, secretKey)
    next()
  } catch (e) {
    console.error(e)
    return res.status(403).json({ message: 'Not authorized user' })
  }
}
