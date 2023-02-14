const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Postagem = new Schema({
    titulo:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        require:true
    },
    descricao:{
        type:String,
        require:true
    },
    conteudo:{
        type: String,
        require:true
    },
    categoria:{//nome usado no populate
        type:Schema.Types.ObjectId,//esse campo armazena algum id de categoria
        ref: "Categorias", //passar a referencia pelo tipo de objeto ou seja o nome que vc da na model Post_model  mongoose.model('Categorias',Categoria)
        required:true,
   
    },
    data:{
        type:Date,
        default:Date.now()
    }
    

})

mongoose.model("Postagem",Postagem)