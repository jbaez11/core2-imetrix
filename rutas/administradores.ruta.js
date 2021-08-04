const express = require('express');

const app = express();
//importar controlador
const Administradores = require('../controladores/administradores.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');
//rutas http

app.get('/mostrar-administradores', verificarToken,  Administradores.mostrarAdministradores);
app.post('/crear-administrador', verificarToken,  Administradores.crearAdministrador);
app.put('/editar-administrador/:id', verificarToken,  Administradores.editarAdministrador);
app.delete('/borrar-administrador/:id', verificarToken,  Administradores.borrarAdministrador);
app.post('/login', Administradores.login);


//exportar la ruta
module.exports = app;
