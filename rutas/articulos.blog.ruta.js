const express = require('express');

const app = express();
//importar controlador
const Articulos = require('../controladores/articulos.blog.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');

//rutas http

app.get('/mostrar-articulos', Articulos.mostrarArticulos);
app.post('/crear-articulo',  verificarToken, Articulos.crearArticulo);
app.put('/editar-articulo/:id', verificarToken,  Articulos.editarArticulo);
app.delete('/borrar-articulo/:id', verificarToken,  Articulos.borrarArticulo);

//exportar la ruta
module.exports = app;
