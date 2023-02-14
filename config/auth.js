const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//Model de usuário
require("../Models/Usuario")
const Usuario = mongoose.model("usuarios")

module.exports = function(passport){                    //mesmo nome do name do formulario
    passport.use(new localStrategy({usernameField:'email',passwordField:'senha'},(email,senha,done)=>{
        Usuario.findOne({email:email}).then((usuario)=>{
            if(!usuario){
                return done(null,false,{message:"Esta conta nao existe"})
            }
            bcrypt.compare(senha,usuario.senha,(erro,batem)=>{
                if(batem){
                    return done(null,usuario)
                }else{
                    return done(null,false,{message:"senha incorreta"})
                }
            })

        })
    }))

    passport.serializeUser((usuario,done)=>{
        done(null,usuario.id)
    })

    passport.deserializeUser((id,done)=>{
        Usuario.findById(id,(err,usuario)=>{
            done(err,usuario)
        })
    })

}