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

//evitar devolver en la data el campo password

administradoresSchema.methods.toJSON = function(){
    let administrador = this;
    let adminObject = administrador.toObject();
    delete adminObject.password;

    return adminObject;
}

module.exports = mongoose.model("administradores",administradoresSchema)