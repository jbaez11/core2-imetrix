const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articulosSchema = new Schema({
    portada:{
        type: String,
        required : [true , "La imagen es obligatoria"]
    },
    titulo:{
        type: String,
        required : [true , "el titulo es obligatorio"] 
    },
    intro:{
        type: String,
        required : [true , "la introduccion es obligatoria"] 
    },
    url:{
        type: String,
        required : [true , "la url es obligatoria"] 
    },
    contenido:{
        type: String,
        required : [true , "el contenido es obligatoria"] 
    }
    
});


module.exports = mongoose.model("articulosblogs",articulosSchema)