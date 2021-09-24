const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let introSchema = new Schema({
    imagen:{
        type: String,
        required : [true , "La imagen es obligatoria"]
    },
    titulo:{
        type: String,
        required : [true , "el titulo es obligatorio"] 
    },
    descripcion:{
        type: String,
        required : [true , "la descripcion es obligatoria"] 
    }
    
});


module.exports = mongoose.model("intropags",introSchema)