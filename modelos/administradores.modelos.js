const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let administradoresSchema = new Schema({
    usuario:{
        type: String,
        required : [true , "el usuario es obligatorio"],
        unique:true
    },
    password:{
        type: String,
        required : [true , "el password es obligatorio"] 
    },
    
    
});


module.exports = mongoose.model("administradores",administradoresSchema)