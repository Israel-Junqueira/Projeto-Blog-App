const express = require('express'); //QUARTA PARTE
const router = express.Router();

const mongose = require('mongoose');// (Parte 7)
require("../Models/Post_model"); // (Parte 7)
const Categoria = mongose.model("Categorias");// (Parte 7)

require("../Models/Postagem");
const Postagem = mongose.model("Postagem");

const {eAdmin} = require("../helpers/eAdmin")// Quer dizer que dentro do objeto eAdmin vc quer pergar apenar a função eAdmin


router.get("/",eAdmin, (req, resp) => { resp.render("admin/index") }) //USEI O RENDER
router.get("/categorias",eAdmin, (req, resp) => {
    // .lean() do mongoose. O que acontece é que as consultas do Mongoose
   //retornam um Mongoose Document e eles são muito pesados para o JS. O método .lean() resolve esse problema retornando um objeto simples.
                    //voce pode usar o find().selec({nome:1}) para mostrar apenas esse parametro 
    Categoria.find().sort({Date:-1}).lean().then((categorias) => { resp.render("admin/categorias", { categorias: categorias }) }).catch((erro) => { req.flash("error_msg", "Houve um erro ao listar as categorias", resp.redirect("/admin")) })
})          
                        //e agora para proteger a rota vc define o eAdmin
router.get("/categorias/add",eAdmin, (req, resp) => { resp.render("admin/addcategorias") })
router.get("/categorias/nova",eAdmin, (req, resp) => { resp.render("admin/novacategoria") })
                                                                //aqui se usa params pois esta trabalhando com parametros e nao formularios
router.get("/categorias/edit/:id",(req,resp)=>{Categoria.findOne({_id:req.params.id}).lean().then((update)=>{resp.render("admin/update",{update:update})})})
router.post("/categorias/edit",(req,resp)=>{
Categoria.findOne({_id:req.body.id}).then((categorias)=>{
    categorias.nome = req.body.nome
    categorias.slug = req.body.slug

    categorias.save().then(()=>{
        req.flash("sucess_msg", "Categoria editada com sucesso!")
        resp.redirect("/admin/categorias")
    }).catch((error)=>{req.flash("error_msg", "Erro ao cadastrar categoria!: "+error)
    resp.redirect("/admin/categorias")})})
     /*Segundo modo de fazer 
    Categoria.where({_id:req.body.id}).update({nome:req.body.nome,slug:req.body.slug}).then(()=>{
        req.flash("sucess_msg", "Categoria editada com sucesso!")
        resp.redirect("/admin/categorias")
    }).catch((error)=>{
        req.flash("error_msg", "Erro ao cadastrar categoria!")
        resp.redirect("/admin/categorias")})
    })
    */
})
   
router.get("/categorias/warning/:id",eAdmin,(req,resp)=>{
    Categoria.findById({_id:req.params.id}).lean().then((warning)=>{resp.render("admin/warning",{warning:warning})})
})
router.get("/categorias/delet/:id",eAdmin,(req,resp)=>{
            Categoria.deleteOne({_id: req.params.id}).then(()=>{req.flash("sucess_msg","Categoria excluida com sucesso"),resp.redirect("/admin/categorias")}).catch((err)=>{"error_msg","Erro ao excluir categoria!:"+err})
})
router.post("/categorias/delet2",eAdmin,(req,resp)=>{
    Categoria.deleteOne({_id: req.body.teste}).then(()=>{req.flash("sucess_msg","Categoria excluida com sucesso"),resp.redirect("/admin/categorias")}).catch((err)=>{"error_msg","Erro ao excluir categoria!:"+err})
})
router.post("/categorias/add",eAdmin, (req, resp) => { //(Parte 8 )
    //---------------------------------------------
    //(Parte 10) validação de formulario 
    var error = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        error.push({ text: "Nome invalido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        error.push({ text: "slug invalido" })
    }

    if (req.body.nome.length < 3) {
        error.push({ text: "Nome curto demais!" })
    }

    if (error.length > 0) {
        resp.render("admin/addcategorias", { error: error })
    } else {
        //----------------------------------------------
        //daq pra baixo criei na parte 8 da documentação
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        //VARIAVEL    ,  AQ E O VALOR QUE IRA PRA VARIAVEL
        new Categoria(novaCategoria).save().then(() => {
            req.flash("sucess_msg", "Categoria criada com sucesso!"),
                resp.redirect("/admin/categorias")
        }).catch((erro) => {
            req.flash("error_msg", "Erro ao cadastrar categoria!"),
                resp.redirect("/admin")
        })
    }
})
//----------------- rotas da postagem
router.get("/postagem",eAdmin,(req,resp)=>{
    Categoria.find().lean().then((categoria)=>{ resp.render("admin/postagem",{categoria:categoria})}).catch((err)=>{"error_msg","erro ao trazer as categorias"})

   
})

router.post("/postagem/nova",eAdmin,(req,resp)=>{
    const Postagems ={
        titulo: req.body.titulo,
        slug: req.body.slug,
        descricao:req.body.descricao,
        categoria:req.body.idcategoria,
        conteudo:req.body.conteudo
    }

    new Postagem(Postagems).save().then(()=>{req.flash("sucess_msg","Postagem criada com sucesso!"),resp.redirect("/admin/postagem/list")}).catch((err)=>{req.flash("error_msg","Erro ao cadastrar Postagem!"+err),resp.redirect("/admin")})
})

router.get("/postagem/list",eAdmin,(req,resp)=>{
                                        //categoria e o nome do campo da tabela postagem
    Postagem.find().lean().populate({path:'categoria',strictPopulate:false}).sort({data:"desc"}).then((postagens)=>{resp.render("admin/postagemList",{postagens:postagens})}).catch((erro)=>{req.flash("error_msg","erro ao trazer a lista de postagens"+erro),resp.render("admin/")})
    
})

router.get("/postagem/update/:id",(req,resp)=>{
    Postagem.findOne({_id:req.params.id}).lean().then((postagem)=>{
        Categoria.find().lean().then((categoria)=>{
            resp.render("admin/updatePostagens",{categoria:categoria,postagem:postagem})
            }).catch((err)=>{
            req.flash("error_msg","deu ruim aq"+err)
            resp.render("admin/updatePostagens")})
    }).catch((err)=>{
        req.flash("error_msg","deu ruim aq"+err)
    })
})

router.post("/postagem/update",(req,resp)=>{
    Postagem.findOne({_id: req.body.id}).lean().then((postagem)=>{

        Postagem.where({_id:req.body.id}).updateOne({titulo:req.body.titulo,slug:req.body.slug,descricao:req.body.descricao,conteudo:req.body.conteudo,categoria:req.body.idcategoria}).then(()=>{
            req.flash("sucess_msg", "Categoria editada com sucesso!")
            resp.redirect("/admin/postagem/list")
        }).catch((error)=>{
            req.flash("error_msg", "Erro ao cadastrar categoria!")
            resp.redirect("/admin/postagem/list")})
        })
})

router.get("/postagem/excluir/:id",(req,resp)=>{
    Postagem.deleteOne({_id:req.params.id}).then(()=>{req.flash("sucess_msg","Postagem Deletada com Sucesso"),resp.redirect("/admin/postagem/list")
}).catch((err)=>{req.flash("error_msg","erro ao excluir postagem"+err)})
})

module.exports = router