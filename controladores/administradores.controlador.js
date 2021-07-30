//importar el modelo
const Administradores = require('../modelos/administradores.modelos');

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
        password: body.password,
        
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

//exportar funciones del controlador

module.exports = {
    mostrarAdministradores,
    crearAdministrador,
}