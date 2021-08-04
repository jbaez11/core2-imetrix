//importar el modelo
const Administradores = require('../modelos/administradores.modelos');

//modulo para encriptar contraseñas
const bcrypt = require('bcrypt');

//modulo para generar token de verificacion
const jwt = require('jsonwebtoken');



//funcion get 

let mostrarAdministradores = (req,res)=>{

    Administradores.find({})
    .exec((err,data)=>{
        if(err){
            return res.json({
                status: 500,
                mensaje: "error en la peticion"
            })
        }
        //contar cantidad de registros

        Administradores.countDocuments({},(err,total)=>{
            if(err){
                return res.json({
                    status:500,
                    mensaje:"error en la peticion"
                })
            }

            res.json({
                status:200,
                total,
                data
            })
        })

        
    })
}

//funcion post

let crearAdministrador = (req,res)=>{

    //obtener cuerpo del formulario

    let body = req.body;

    //obtener datos del formulario y pasarlos al modelo

    let administradores = new Administradores({
        
        usuario: body.usuario,
        password: bcrypt.hashSync(body.password,10),
        
    })

    // guardar en mongo db

    administradores.save((err,data)=>{
        if(err){

            return res.json({
            status:400,
            mensaje:"Error al almacenar el administrador",
            err
            })
        }

        res.json({
            status:200,
            data,
            mensaje:"El administrador ha sido creado con exito"
        })
    });

}

//funcion put

let editarAdministrador  = (req,res)=>{

    //capturar id del admin

    let id = req.params.id;

    //obtener el cuerpo del formulario

    let body = req.body;

    //1.validar que exista el administrador

    Administradores.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia del admin

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Administrador no existe en la BD",
                
            })

        }

        let pass = data.password;

        //2. validar cambio de contraseña
        let validarCambioPassword = (body,pass)=>{
            return new Promise((resolve,reject)=>{
                if(body.password == undefined){
                    resolve(pass);
                }else{
                    pass = bcrypt.hashSync(body.password,10);
                    resolve(pass);
                }
            })
        }
        //3. actualizar registros
        let cambiarRegistrosBD = (id, body, pass)=>{
            return new Promise((resolve,reject)=>{

                let datosAdministrador = {
                    usuario : body.usuario,
                    password : pass
                }
        
                //actualizar en mongoDB
        
                Administradores.findByIdAndUpdate(id,datosAdministrador, {new:true,runValidators:true}, (err,data) => {
                    if(err){
                        let respuesta = {
                            res:res,
                            error:err
                        }

                        reject(respuesta);
                        // return res.json({
                        //     status:400,
                        //     mensaje: "Error al editar slide",
                        //     err
                        // }) 
                    }
        
                    

                    let respuesta = {
                        res:res,
                        data:data
                    }
                    resolve(respuesta);
                })

            })

        }
        //sincronizar las promesas
        validarCambioPassword(body,pass).then(pass => {
            cambiarRegistrosBD(id,body,pass).then(respuesta =>{
                respuesta["res"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje: "El Administrador ha sido actualizado con exito"
                })
            }).catch(respuesta =>{
                respuesta["res"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje: "Error al editar el Administrador"
                }) 
            })
        }).catch(respuesta => {
            respuesta["res"].json({
                status:400,
                
                mensaje: respuesta["mensaje"]
            })  
        })


    })


}

//funcion delete

let borrarAdministrador = (req,res)=>{
    //capturar id Administrador a borrar

    let id = req.params.id;

    // 1. validar existencia del Administrador

    Administradores.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Administrador

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Administrador no existe en la BD",
                
            })

        }

       
        //borrar registro en mongo DB

        Administradores.findByIdAndRemove(id,(err,data)=>{
            if(err){
                return res.json({
                    status:500,
                    mensaje: "Error al borrar el Administrador",
                    err
                })
            }

            res.json({
                status:200,
                mensaje: "El Administrador ha sido borrado exitosamente"
            })
        })

    })
}

//funcion login
let login = (req,res)=>{

    //obtener cuerpo del formulario

    let body = req.body;

    //recorrer bd, buscando coincidencia con el usuario

    Administradores.findOne({usuario:body.usuario}, (err,data)=>{
        
        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Administrador

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Usuario es incorrecto",
                
            })

        }

        //validar contraseña correcta

        if(!bcrypt.compareSync(body.password, data.password)){
            
            return res.json({
                status:404,
                mensaje: "La contraseña es incorrecta",
                
            })
        }

        //generar token de autenticacion
        //expiresIn: 60*60*24*1 duracion 24 horas token
        let token = jwt.sign({
            data,

        },process.env.SECRET, {expiresIn: process.env.CADUCIDAD})

        res.json({
            status:200,
            token
        })
    })
}
//exportar funciones del controlador

module.exports = {
    mostrarAdministradores,
    crearAdministrador,
    editarAdministrador,
    borrarAdministrador,
    login,
}