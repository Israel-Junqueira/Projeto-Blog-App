const { hash } = require('bcryptjs');
const express =require('express');
const router = express.Router();
const mongoose = require('mongoose')
require("../Models/Usuario")
const Usuario = mongoose.model("usuarios") //nome dado na model do schema no arquivo Usuarios.js

const bcrypt = require('bcryptjs')

//-----------passport
const passport = require('passport');

router.get("/registro",(req,resp)=>{
    resp.render("usuarios/registro")
})

router.get("/login",(req,resp)=>{
    resp.render("usuarios/login")
})

router.post("/login",(req,resp,next)=>{
   passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/usuario/login",
    failureFlash:true
   })(req,resp,next)
})

router.post("/registro",(req,resp)=>{
     var error =[]
    if(req.body.senha !== req.body.senhaConfirme){
       
        error.push({text:"Senhas distintas"})
        
    }


    if(error.length >0){
        resp.render("usuarios/registro", { error: error })
    }else{
        
        Usuario.findOne({email:req.body.email}).then((usuario)=>{
            if(usuario != null){
        
                req.flash("error_msg","Já existe usuarios cadastrados com esse e-mail !")
            }else{
               
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.senha,salt) 
               
                const novousuario = new Usuario({
                    nome: req.body.nome,
                    email:req.body.email,
                    eAdmin:1, //usei para atribuir um admin
                    senha:hash,
  
                })
              
                        novousuario.save().then(()=>{
                            req.flash("sucess_msg","usuario criado com sucesso!")
                            resp.redirect("/usuario/login")
                        }).catch((err)=>{
                            req.flash("error_msg","erro ao cadastrar novo usuario"+err)
                            resp.redirect("/usuario/registro")
                    })
            }
        }).catch((erro)=>{
            req.flash("error_msg","Houve um erro ao buscar usuario"+error)
        })
      
    }
})

router.get("/logout",(req,resp)=>{
    req.logout(()=>{
        req.flash("sucess_msg","Logout bem sucedido")
        resp.redirect("/")
    }).catch((erro)=>{
        req.flash("error_msg","erro ao fazer o logout")
    });
   
})

module.exports =router