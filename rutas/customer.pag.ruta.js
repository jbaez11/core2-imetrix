const express = require('express');

const app = express();
//importar controlador
const Customer =require('../controladores/customer.pag.controlador');
//importar middleware
const {verificarToken} = require('../middlewares/autenticacion');

//rutas http

app.get('/mostrar-customer', Customer.mostrarCustomer);
app.post('/crear-customer', verificarToken, Customer.crearCustomer);
app.put('/editar-customer/:id', verificarToken, Customer.editarCustomer);
app.delete('/borrar-customer/:id', verificarToken, Customer.borrarCustomer);
app.get('/mostrar-img-customer/:imagen', Customer.mostrarImg);

//exportar la ruta
module.exports = app;
