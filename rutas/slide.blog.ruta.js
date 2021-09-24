const express = require('express');

const app = express();
//importar controlador
const Slide =require('../controladores/slide.blog.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');

//rutas http

app.get('/mostrar-slide', Slide.mostrarSlide);
app.post('/crear-slide', verificarToken, Slide.crearSlide);
app.put('/editar-slide/:id', verificarToken, Slide.editarSlide);
app.delete('/borrar-slide/:id', verificarToken, Slide.borrarSlide);
app.get('/mostrar-img/:imagen', Slide.mostrarImg);

//exportar la ruta
module.exports = app;
