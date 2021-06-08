const jwt = require('jsonwebtoken');

export const isAfipAuth =  (req:any,res:any,next:any)=>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token === null) return res.sendStatus(401)
  
    jwt.verify(token, "claveSecretaDelToken", (err:any,user:any) => {
      console.log(user)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }