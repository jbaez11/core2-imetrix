const express = require('express');

const app = express();

const Galeria = require('../controladores/galeria.blog.controlador');

//rutas http

app.get('/mostrar-galeria', Galeria.mostrarGaleria);
app.post('/crear-galeria', Galeria.crearGaleria);
app.put('/editar-galeria/:id', Galeria.editarGaleria);
app.delete('/borrar-galeria/:id', Galeria.borrarGaleria);

//exportar la ruta
module.exports = app;

