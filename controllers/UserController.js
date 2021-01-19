const PasswordToken = require("../models/PasswordToken")
const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const secret = "555555sa5a5s5ds5"
class UserController {
    async index(req, res) {
        var user = await User.findAll()
        res.status(200)
        res.json(user)
    }
    async findUser(req, res) {
        var id = req.params.id
        const user = await User.findById(id)
        if (user == undefined) {
            res.status(404)
            res.json({err:"Recurso não encontrado"})
        } else {
         res.status(200)
         res.json(user)   
        }
    } 
    async create(req, res) {
        var { email, name, password } = req.body
        if (email == undefined || email == null) {
            res.status(403)
            res.json({ err: "E-mail inválido!" })
        }
        if (name == undefined || name == null) {
            res.status(403)
            res.json({ err: "Nome inválido!" })
        }
        if (password == undefined) {
            res.status(403)
            res.json({ err: "Senha inválido!" })
        }
        const emailexists = await User.findEmail(email)
        if (emailexists) {
            res.status(406)
            res.json({ err: "Email duplicado" })
            return
        }
        await User.create(email, password, name)

        res.status(200)
        res.send('Ok')
    }
    async edit(req, res) {
        const { id, name, role, email } = req.body;
        var result = await User.update(id, email, name, role)
        if (result != undefined) {
            if (result.status) {
                res.status(200)
                res.send("Tudo certo!")
            } else {
                res.status(406)
                res.json(result.err)

            }
        } else {
            res.status(406)
            res.json(result.err) 
        }
    }
    async delete(req, res) {
        const id = req.params.id
        const result = await User.delete(id)

        if (result.status) {
            res.status(200)
            res.send("Tudo Ok!")

        } else {
            res.status(406)
            res.send(result.err)
        }
    }
    async recoverPassword(req, res) {
        const { email } = req.body
        const result = await PasswordToken.create(email)
        if (result.status) {
            res.status(200)
            res.json({ token: result.token })
        } else {
            res.status(400)
            res.json({ err: result.err })
        }
    }
    async changPass(req, res) {
        const { token } = req.body
        const { password } = req.body
        const isTokenValid = await PasswordToken.validator(token)
        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
           
            res.status(200)
            res.json({msg:"Senha alterada"})
        } else {
            res.status(406)
            res.json({err: "Token inválido"})
        }
    }
    async login(req, res) {
        const { email, password } = req.body
        const user = await User.findByEmail(email)
        if (user != undefined) {
            const result = await bcrypt.compare(password, user.password)
            if (result) {
                var token = jwt.sign({ email:user.email,role:user.role }, secret);
                res.status(200)
                res.json({ status: token })
            } else {
                res.status(400)
                res.json({ err:"Senha inválida" })
            }
            
        } else {
            res.status(404)
            res.json({ status: false })
        }
    }
}
module.exports = new UserController();