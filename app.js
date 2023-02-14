//configurações do express,mongoDb,handlebars,body-parser
//Carregando Modulos(Parte 1)
const express = require('express');
const handlebars = require('express-handlebars');
const mongoose  = require('mongoose');  
const bodyparser = require('body-parser');
const app = express();
//---------admin config
const admin = require("./Router/admin");// (Parte 4) avisando o express do arquivo admin
//----------------------
//---------------usuarios----------
const usuario = require("./Router/usuario")
//---------------------------------
//--------------Postagem---------------------
const home = require("./Router/home")
//------------------------------------------

const path = require("path");
const session = require("express-session");//(Parte 9) sessões e cokies
const flash = require("connect-flash");

//-------------------------------------------
//------------------Bcrypt-------------------
const bcrypt = require('bcryptjs')
//----------------Passport---------------------------
const passport = require("passport");
const { rmSync } = require('fs');
require("./config/auth")(passport)

//configurações (Parte 1)
    //bcrypt hash
    //body-parser (Parte 3)
      app.use(bodyparser.urlencoded({extended:true}));//A extendedopção permite escolher entre analisar os dados codificados em URL com a querystringbiblioteca (quando false) ou a qsbiblioteca (quando true). A sintaxe “estendida” permite que objetos e arrays ricos sejam codificados no   formato codificado por URL, permitindo uma experiência semelhante a JSON 
      app.use(bodyparser.json());
   
    //handlebars (Parte 3 )
      app.engine('handlebars',handlebars.engine({defaultLayout:'main'}));
      app.set('view engine','handlebars');
    //Public Past tudo que tem app.use é um middleware
                                //aqui vc pegara o caminho absoluto para a pasta public
                            //se vc esquecer disto e possivel que quando tente renderizar caminhos dentro de outros arquivos, não funcione
      app.use(express.static(path.join(__dirname,"Public")));//avisando o express que a pasta com arquivos staticos e a pasta public (parte 5)
      app.use((requisicao,resposta,next)=>{//isso e um midware nao se engane
        console.log("oi midware")
        next()//se vc nao colocar esse next() o projeto fica rodando infinitamente e nao sai do lugar
      })
      //Sessão
      app.use(session({secret:"testantoasession",resave:true,saveUninitialized:true}));// (parte 9)
      //passport 
      app.use(passport.initialize())
      app.use(passport.session())
      //flash
      app.use(flash());//(parte 9) o flash precisa ficar em baixo da session
    //middleware
      app.use((req,resp,next)=>{ //(parte 9.6)
        resp.locals.sucess_msg =req.flash("sucess_msg") //variavel global 
        resp.locals.error_msg = req.flash("error_msg") //variaveis global guardam as mensagem de erro e sucesso
        resp.locals.error= req.flash("error") //variavel do passport
        resp.locals.user = req.user || null; //armazena os dados do usuario online
        next();
      });
    //mongoose config (parte 7)
      mongoose.set("strictQuery",true);//elimina o aviso de nova versao 
      mongoose.Promise = global.Promise;
      mongoose.connect("mongodb://localhost/db_Blog").then(()=>{"Conexão Bem sucedida"}).catch((err)=>{"Falha!! conexão mal sucedida,MOTIVO:"+err})

    //rotas, sempre que criar um novo arquivo precisar avisar o express (Parte 4)
      app.use('/admin',admin);//as rotas sempre possuem um prefixo "admin" para criar uma rota sem prefixo crie a rota dentro deste mesmo arquivo
      app.use('/',home); //lembre -se que é necessario exportar o arquivo Postagem.js para que fique amarelinho aq
      app.use("/usuario",usuario);

    //outros
      //com hiroku so adicionar o process.env.PORT
    const Port = process.env.PORT || 8000;
    app.listen(Port,()=>{
        return console.log("Servidor Rodando !!")
    });
/*
antes sem o hiroku
const Port =8000;
app.listen(Port,()=>{
    return console.log("Servidor Rodando !!")
});
*/