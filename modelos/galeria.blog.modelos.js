const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let galeriaSchema = new Schema({
    foto:{
        type: String,
        required : [true , "La imagen es obligatoria"]
    }
    
});


module.exports = mongoose.model("galeriasblogs", galeriaSchema)