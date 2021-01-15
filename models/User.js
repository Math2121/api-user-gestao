const knex = require('../database/connection')
const bcrypt = require('bcrypt')
const PasswordToken = require('./PasswordToken')

class User {
    async findAll() {
        try {
            const result = await knex.select(['id','name','email','role']).table('users')
            return result
        } catch (error) {
            console.log(error)
        }

    }
    async findById(id) {
            try {
            const result = await knex.select(['id','name','email','role']).where({id:id}).table('users')
            if(result.length>0){
                return result[0]
            }else{
                return undefined
            }
         
        } catch (error) {
            console.log(error)
        }

    }

    async findByEmail(email) {
        try {
            const result = await knex.select(['id', 'name', 'email', 'role']).where({ email: email }).table('users')
            if (result.length > 0) {
                return result[0]
            } else {
                return undefined
            }

        } catch (error) {
            console.log(error)
        }

    }
    async create(email, password, name) {
        try {
            var hash = await bcrypt.hash(password, 10)
            await knex.insert({ email, password: hash, name, role: 0 }).table('users')
        } catch (error) {
            console.log(error)
        }
    }
    async findEmail(email) {
        try {
            const res = await knex.select("*").from('users').where({ email: email })
            if (res.length > 0) {
                return true
            } else {
                return false
            }

        } catch (error) {
            console.log(error)
        }

    }
    async update(id,email,name,role) {
       var user =  await this.findById(id)
        if (user != undefined) {
            const editUser = {}
            if (email != undefined) {
                if (email != user.email) {
                    const result = await this.findEmail(email)
                    if (result == false) {
                        editUser.email = email
                    } else {
                        return { status: false, err:"O e-mail já está cadastrado"}
                    }
                }
            }


            if (name != undefined) {
               
                editUser.name = name
                
            }



            if (role != undefined) {
                editUser.role = role
            }
            try {
                await knex.update(editUser).where({ id: id }).table("users") 
                return { status: true} 
            } catch (error) {
                return { status: false, err: error } 
            }
           
       }
    }

    async delete(id) {
        const user = await this.findById(id)
        if (user != undefined) {
            try {
                await knex.delete().where({ id: id }).table('users')
                return { status: true}
            } catch (error) {
                return { status:false,err:error}
            }
        } else {
            return {status: false, err: "O usuário não existe!"}
        }
    }
    async changePassword(newPassword, id, token) {
        const hash = await bcrypt.hash(newPassword, 10);
        await knex.update({ password: hash }).where({ id: id }).table("users");
        await PasswordToken.Usedo(token)
        
   
   }

}
module.exports = new User()