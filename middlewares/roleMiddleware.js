const jwt = require('jsonwebtoken')
const { secretKey } = require('../config')

module.exports = function (roles) {
  return function (req, res, next) {
    if (req.method === 'OPTIONS') next()

    try {
      const token = req.headers.authorization.split(' ')[1]
      if (!token) {
        return res.status(403).json({ message: 'Not authorized user' })
      }
      // FOR AUTHORIZATION (any) CHECK
      // Put into request 'user' object with payload (user ID & roles) from JWT
      // req.user = jwt.verify(token, secretKey)

      // FOR SPECIFIC ROLES (param 'roles') CHECK
      const {roles: userRoles} = jwt.verify(token, secretKey)

      let hasRole = false
      userRoles.forEach(role => {
        if (roles.includes(role)) hasRole = true
      })
      if (!hasRole) {
        return res.status(403).json({message: 'Access is denied'})
      }

      next()
    } catch (e) {
      console.error(e)
      return res.status(403).json({ message: 'Not authorized user' })
    }
  }
}
