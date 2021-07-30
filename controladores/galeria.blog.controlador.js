const Galeria = require('../modelos/galeria.blog.modelos');

//administracion de carpetas y archivos
const fs = require('fs');

//funcion get

let mostrarGaleria = (req,res)=>{
    
    Galeria.find({})
    .exec((err,data)=>{
        if(err){
            return res.json({
                status: 500,
                mensaje: "error en la peticion"
            })
        }
        //contar cantidad de registros

        Galeria.countDocuments({},(err,total)=>{
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

let crearGaleria = (req,res)=>{

    //obtener cuerpo del formulario

    let body = req.body;
    //identificar si vienen archivos
    if(!req.files){
        return res.json({
            status:500,
            mensaje:"la imagen no puede ir vacia",
            
        })
    }

    //capturar archivo/imagen

    let archivo = req.files.archivo;
    
    //validar extension del archivo

    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
        return res.json({
            status:400,
            mensaje:"la imagen debe ser formato PNG o JPG",
            
        })
    }

    //validar tamaño del archivo

    if(archivo.size > 2000000){
        return res.json({
            status:400,
            mensaje:"la imagen debe ser inferior a 2MB",
            
        })
    }

    //cambiar nombre al archivo

    let nombre = Math.floor(Math.random()*10000);
    
    //capturar la extension del archivo

    let extension = archivo.name.split('.').pop();
    
    //mover archivo a la carpeta

    archivo.mv(`./archivos/blog/galeria/${nombre}.${extension}`, err => {
        if(err){
            return res.json({
                status:500,
                mensaje:"Error al guardar la imagen",
                err
                
            })
        }

        //obtener datos del formulario y pasarlos al modelo

        let galeria = new Galeria({
            foto : `${nombre}.${extension}`,
            
        })

        // guardar en mongo db

        galeria.save((err,data)=>{
            if(err){

                return res.json({
                status:400,
                mensaje:"Error al almacenar el galeria",
                err
                })
            }

            res.json({
                status:200,
                data,
                mensaje:"El galeria ha sido creado con exito"
            })
        });


    })

 
    

}

//funcion put

let editarGaleria = (req,res)=>{

    //capturar id Galeria

    let id = req.params.id;

    //obtener el cuerpo del formulario

    let body = req.body;

    // 1. validar existencia del Galeria

    Galeria.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Galeria

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Galeria no existe en la BD",
                
            })

        }

        let rutaImagen = data.foto

        // 2. validar cambio de IMG
        let validarCambioArchivo = (req,rutaImagen)=>{

            return new Promise((resolve,reject)=>{
                if(req.files){

                    //capturar archivo/imagen

                    let archivo = req.files.archivo;
                    
                    //validar extension del archivo

                    if(archivo.mimetype != 'image/jpeg' && archivo.mimetype != 'image/png'){
                        
                        let respuesta = {
                            res:res,
                            mensaje: "la imagen debe ser formato PNG o JPG" 
                        }
                        reject(respuesta)
                    }

                    //validar tamaño del archivo

                    if(archivo.size > 2000000){
                        
                        let respuesta = {
                            res:res,
                            mensaje: "la imagen debe ser inferior a 2MB" 
                        }
                        reject(respuesta)
                    }

                    //cambiar nombre al archivo

                    let nombre = Math.floor(Math.random()*10000);
                    
                    //capturar la extension del archivo

                    let extension = archivo.name.split('.').pop();

                    //mover el archivo

                    archivo.mv(`./archivos/blog/galeria/${nombre}.${extension}`, err =>{
                        if(err){
                            

                            let respuesta = {
                                res:res,
                                mensaje: "Error al guardar la imagen" 
                            }
                            reject(respuesta)

                            
                        }

                        //borrar antigua imagen

                        if(fs.existsSync(`./archivos/blog/galeria/${rutaImagen}`)){
                            fs.unlinkSync(`./archivos/blog/galeria/${rutaImagen}`)
                        }

                        //dar valor a la nueva imagen
                        rutaImagen = `${nombre}.${extension}`;

                        resolve(rutaImagen);
                    })

                }else{
                    resolve(rutaImagen)
                }
            })

        }
        // 3. actualizar registros

        let cambiarRegistrosBD = (id, rutaImagen)=>{
            return new Promise((resolve,reject)=>{

                let datosGaleria = {
                    foto : rutaImagen,
                   
                }
        
                //actualizar en mongoDB
        
                Galeria.findByIdAndUpdate(id,datosGaleria, {new:true,runValidators:true}, (err,data) => {
                    if(err){
                        let respuesta = {
                            res:res,
                            error:err
                        }

                        reject(respuesta);
                        // return res.json({
                        //     status:400,
                        //     mensaje: "Error al editar Galeria",
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

        // sincronizar las promesas

        validarCambioArchivo(req,rutaImagen).then(rutaImagen => {
            cambiarRegistrosBD(id,rutaImagen).then(respuesta =>{
                respuesta["res"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje: "la foto de la Galeria ha sido actualizado con exito"
                })
            }).catch(respuesta =>{
                respuesta["res"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje: "Error al editar el Galeria"
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
let borrarGaleria = (req,res)=>{
    //capturar id Galeria a borrar

    let id = req.params.id;

    // 1. validar existencia del Galeria

    Galeria.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Galeria

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Galeria no existe en la BD",
                
            })

        }

        //borrar imagen

        if(fs.existsSync(`./archivos/blog/galeria/${data.foto}`)){
            fs.unlinkSync(`./archivos/blog/galeria/${data.foto}`)
        }

        //borrar registro en mongo DB

        Galeria.findByIdAndRemove(id,(err,data)=>{
            if(err){
                return res.json({
                    status:500,
                    mensaje: "Error al borrar la foto de la Galeria",
                    err
                })
            }

            res.json({
                status:200,
                mensaje: "la foto ha  sido borrado exitosamente"
            })
        })

    })
        


}


module.exports = {
    mostrarGaleria,
    crearGaleria,
    editarGaleria,
    borrarGaleria,
}