const jwt = require("jsonwebtoken")

const secret = "555555sa5a5s5ds5"
module.exports = function (req, res, next) {
  const authToken = req.headers['authorization']
  if (authToken != undefined) {
    const beare = authToken.split(" ")
    const token = beare[1]
  
    try {
      const decoded = jwt.verify(token, secret)
      if (decoded.role == 1) {
        next()
      } else {
        res.status(404)
        res.send("Você não tem autorização")
        return
      }
      
    } catch (error) {
      res.status(404)
      res.send("Você não está autenticado")
      return
    }
  } else {
    res.status(403)
    res.send("Você não está autenticado")
    return
  }
}