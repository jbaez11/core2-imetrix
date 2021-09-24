const express = require('express');

const app = express();
//importar controlador
const Intro =require('../controladores/intro.pag.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');

//rutas http

app.get('/mostrar-intro', Intro.mostrarIntro);
app.post('/crear-intro', verificarToken, Intro.crearIntro);
app.put('/editar-intro/:id', verificarToken, Intro.editarIntro);
app.delete('/borrar-intro/:id', verificarToken, Intro.borrarIntro);
app.get('/mostrar-img-intro/:imagen', Intro.mostrarImg);

//exportar la ruta
module.exports = app;
