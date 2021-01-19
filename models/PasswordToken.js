const knex = require('../database/connection')


class PasswordToken {
  async create(email) {
    const user = await User.findByEmail(email)
    if (user != undefined) {
      try {
        const token = Date.now()
        await knex.insert({
          user_id: user.id,
          used: 0,
          token: token
        }).table("password_tokens")
        return { status: true,token:token}
      } catch (error) {
        return { status: false,err:error}
      }
    } else{
      return {status: false, err:"O e-mail não existe no banco de dados"}
    }
  }
  async validator(token) {
    try {
      const result = await knex.select().where({ token: token }).table("password_tokens")
      if (result.length > 0) {
        const tk = result[0]
        if (tk.used) {
          return { status: false }
        } else {
          return {status: true,token:tk}
        }
      } else {
        return { status: false }
      }
    
    } catch (error) {
      return {status: false, err: error}
    }
   
  }
  async Usedo(token) {
    try {
      await knex.update({ used: 1 }).where({ token: token }).table("password_tokens")
      return { status: true }
    } catch (error) {
      console.log(error)
      return { status: false,err:error }
    }
    
  }
}
module.exports = new PasswordToken()