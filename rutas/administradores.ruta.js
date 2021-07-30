const express = require('express');

const app = express();

const Administradores = require('../controladores/administradores.controlador');

//rutas http

app.get('/mostrar-administradores', Administradores.mostrarAdministradores);
app.post('/crear-administrador', Administradores.crearAdministrador);
//app.put('/editar-administrador/:id', Administradores.editarAdministrador);
//app.delete('/borrar-administrador/:id', Administradores.borrarAdministrador);

//exportar la ruta
module.exports = app;
