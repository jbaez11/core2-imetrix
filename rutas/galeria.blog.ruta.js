const express = require('express');

const app = express();
//importar controlador
const Galeria = require('../controladores/galeria.blog.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');
//rutas http

app.get('/mostrar-galeria', Galeria.mostrarGaleria);
app.post('/crear-galeria', verificarToken, Galeria.crearGaleria);
app.put('/editar-galeria/:id', verificarToken, Galeria.editarGaleria);
app.delete('/borrar-galeria/:id', verificarToken, Galeria.borrarGaleria);
app.get('/mostrar-img-galeria/:imagen', Galeria.mostrarImg);

//exportar la ruta
module.exports = app;

