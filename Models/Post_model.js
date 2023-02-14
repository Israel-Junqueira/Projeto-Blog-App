const mongoose = require('mongoose'); //(parte 7)
const Schema = mongoose.Schema;

const Categoria = new Schema({
    nome:{type:String,require:true,default:"usuario"},//default serva para q se o usuario nao digite nada o proprio sistema dá um nome a ele
    slug:{type:String,require:true},
    Date:{type:Date,default:Date.now()}
})

mongoose.model('Categorias',Categoria)
