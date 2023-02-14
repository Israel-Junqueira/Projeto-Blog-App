const express =require('express');
const router = express.Router();
const mongoose = require('mongoose')
require("../Models/Postagem")
const Postagem = mongoose.model("Postagem")
require("../Models/Post_model")
const Categoria = mongoose.model("Categorias")

router.get("/",(req,resp)=>{
    Postagem.find().lean().populate({path:'categoria',strictPopulate:false}).then((postagem)=>{
        
      resp.render("index",{postagem:postagem})
     }).catch((err)=>{
      req.flash("error_msg","erro ao trazer a lista de postagem"+err)
      resp.redirect("/404")
     })
    })

router.get("/404",(req,resp)=>{
    resp.send('erro 404!')
})


router.get("/categoriasLista",(req,resp)=>{
    Categoria.find().lean().then((categoria)=>{
        req.flash("sucess_msg","listada com sucesso")
        resp.render("categorias/index",{categoria:categoria})
        
    }).catch((err)=>{req.flash("error_msg","erro ao trazer a lista de categorias"+err)})
})

router.get("/pertencentes/:id",(req,resp)=>{
    Postagem.find({categoria:req.params.id}).lean().then((postagens)=>{

        Categoria.findOne({_id:req.params.id}).lean().then((categoria)=>{
            console.log(categoria)
            resp.render("categorias/pertencentes",{postagens:postagens,categoria:categoria})}).catch((erro)=>{
            req.flash("error_msg","Erro ao listar as categorias"+erro)
            resp.redirect("index")})
        })
       
        
    
    })

 module.exports = router