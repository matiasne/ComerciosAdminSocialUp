
const jwt = require('jsonwebtoken');

var isAuth = function (req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token === null) return res.sendStatus(401)
  
    jwt.verify(token, "claveSecretaDelToken", (err,user) => {
      console.log(user)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

module.exports = isAuth