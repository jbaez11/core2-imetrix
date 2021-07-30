const express = require('express');

const app = express();

const Articulos = require('../controladores/articulos.blog.controlador');

//rutas http

app.get('/mostrar-articulos', Articulos.mostrarArticulos);
app.post('/crear-articulo', Articulos.crearArticulo);
app.put('/editar-articulo/:id', Articulos.editarArticulo);
app.delete('/borrar-articulo/:id', Articulos.borrarArticulo);

//exportar la ruta
module.exports = app;
