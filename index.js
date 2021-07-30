require('./config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')



const app = express();


//middleware body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit:'10mb', extended: true }))
 
// parse application/json
app.use(bodyParser.json({limit:'10mb', extended: true }))

//middleware para fileUpload
app.use(fileUpload());


//mongoose deprecated

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//importar rutas
app.use( require('./rutas/slide.blog.ruta'));
app.use( require('./rutas/galeria.blog.ruta'));
app.use( require('./rutas/articulos.blog.ruta'));
app.use( require('./rutas/administradores.ruta'));

//conexion BD
mongoose.connect('mongodb://localhost:27017/apirest-imetrix', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  },(err,res)=>{
      if(err){
          throw err;
      }

      console.log("conectado a BD")
  });

//salida puerto HTTP
app.listen(process.env.PORT, () => {
    console.log('habilitado puerto ',process.env.PORT)
});