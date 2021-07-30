const Articulos = require('../modelos/articulos.blog.modelos');

//administracion de carpetas y archivos
const fs = require('fs');
//crear carpetas
const mkdirp = require('mkdirp');
//eliminar carpetas
const rimraf = require('rimraf');

//funcion get

let mostrarArticulos = (req,res)=>{
    
    Articulos.find({})
    .exec((err,data)=>{
        if(err){
            return res.json({
                status: 500,
                mensaje: "error en la peticion"
            })
        }
        //contar cantidad de registros

        Articulos.countDocuments({},(err,total)=>{
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

let crearArticulo = (req,res)=>{

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

    //crear nueva carpeta con el nombre de la url

    let crearCarpeta = mkdirp.sync(`./archivos/blog/articulos/${body.url}`)
    
    //mover archivo a la carpeta

    archivo.mv(`./archivos/blog/articulos/${body.url}/${nombre}.${extension}`, err => {
        if(err){
            return res.json({
                status:500,
                mensaje:"Error al guardar la imagen",
                err
                
            })
        }

        //obtener datos del formulario y pasarlos al modelo

        let articulos = new Articulos({
            portada : `${nombre}.${extension}`,
            titulo: body.titulo,
            intro: body.intro,
            url:body.url,
            contenido: body.contenido
        })

        // guardar en mongo db

        articulos.save((err,data)=>{
            if(err){

                return res.json({
                status:400,
                mensaje:"Error al almacenar los Articulos",
                err
                })
            }

            res.json({
                status:200,
                data,
                mensaje:"El Articulo ha sido creado con exito"
            })
        });


    })

 
    

}

//funcion put

let editarArticulo = (req,res)=>{

    //capturar id Articulos

    let id = req.params.id;

    //obtener el cuerpo del formulario

    let body = req.body;

    // 1. validar existencia del Articulos

    Articulos.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Articulos

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Articulo no existe en la BD",
                
            })

        }

        let rutaImagen = data.portada

        // 2. validar cambio de IMG
        let validarCambioArchivo = (req, body, rutaImagen)=>{

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

                    archivo.mv(`./archivos/blog/articulos/${body.url}/${nombre}.${extension}`, err =>{
                        if(err){
                            

                            let respuesta = {
                                res:res,
                                mensaje: "Error al guardar la imagen" 
                            }
                            reject(respuesta)

                            
                        }

                        //borrar antigua imagen

                        if(fs.existsSync(`./archivos/blog/articulos/${body.url}/${rutaImagen}`)){
                            fs.unlinkSync(`./archivos/blog/articulos/${body.url}/${rutaImagen}`)
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

        let cambiarRegistrosBD = (id, body, rutaImagen)=>{
            return new Promise((resolve,reject)=>{

                let datosArticulos = {
                    portada : rutaImagen,
                    titulo : body.titulo,
                    intro : body.intro,
                    url : body.url,
                    contenido : body.contenido,

                }
        
                //actualizar en mongoDB
        
                Articulos.findByIdAndUpdate(id,datosArticulos, {new:true,runValidators:true}, (err,data) => {
                    if(err){
                        let respuesta = {
                            res:res,
                            error:err
                        }

                        reject(respuesta);
                        // return res.json({
                        //     status:400,
                        //     mensaje: "Error al editar Articulos",
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

        validarCambioArchivo(req,body,rutaImagen).then(rutaImagen => {
            cambiarRegistrosBD(id,body,rutaImagen).then(respuesta =>{
                respuesta["res"].json({
                    status:200,
                    data: respuesta["data"],
                    mensaje: "El Articulo ha sido actualizado con exito"
                })
            }).catch(respuesta =>{
                respuesta["res"].json({
                    status:400,
                    err: respuesta["err"],
                    mensaje: "Error al editar el Articulo"
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
let borrarArticulo = (req,res)=>{
    //capturar id Articulos a borrar

    let id = req.params.id;

    // 1. validar existencia del Articulo

    Articulos.findById(id,(err,data) => {

        // validar que no se tenga error en la BD

        if(err){
            return res.json({
                status:500,
                mensaje: "Error en el servidor",
                err
            })
        }

        //validar existencia Articulos

        if(!data){
            return res.json({
                status:404,
                mensaje: "El Articulo no existe en la BD",
                
            })

        }

        //borrar la carpeta del articulo

        let rutaCarpeta = `./archivos/blog/articulos/${data.url}`;
        rimraf.sync(rutaCarpeta);

        //borrar registro en mongo DB

        Articulos.findByIdAndRemove(id,(err,data)=>{
            if(err){
                return res.json({
                    status:500,
                    mensaje: "Error al borrar el Articulo",
                    err
                })
            }

            res.json({
                status:200,
                mensaje: "El Articulo ha sido borrado exitosamente"
            })
        })

    })
        


}


module.exports = {
    mostrarArticulos,
    crearArticulo,
    editarArticulo,
    borrarArticulo,
}