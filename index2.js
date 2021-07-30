


const bodyParser = require('body-parser');



const app = express();


//middleware body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


//schema


//peticiones get





//post 
app.post('/crear-slide', (req,res) => {
    let slide = req.body;

    res.json({
        slide
    })
})

//put 

app.put('/editar-slide/:id', (req,res) => {
    let id = req.params.id;

    res.json({
        id
    })
})


//delete

app.delete('/borrar-slide/:id', (req,res) => {
    let id = req.params.id;

    res.json({
        id
    })
})
//conexion bd 

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

app.listen(4000, () => {
    console.log('habilitado puerto 4000')
});