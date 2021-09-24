require('./config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cors = require('cors');



const app = express();


//middleware body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({limit:'10mb', extended: true }))
 
// parse application/json
app.use(bodyParser.json({limit:'10mb', extended: true }))

//middleware para fileUpload
app.use(fileUpload());

/*=============================================
EJECUTANDO CORS
=============================================*/

app.use(cors());


//mongoose deprecated

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//importar rutas
app.use( require('./rutas/slide.blog.ruta'));
app.use( require('./rutas/galeria.blog.ruta'));
app.use( require('./rutas/customer.pag.ruta'));
app.use( require('./rutas/intro.pag.ruta'));
app.use( require('./rutas/articulos.blog.ruta'));
app.use( require('./rutas/administradores.ruta'));



//conexion BD
mongoose.connect('mongodb+srv://jonathan10:Jq4LfZcGmOTO39ko@cluster0.vff1e.mongodb.net/apirest-imetrix?retryWrites=true&w=majority', {
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