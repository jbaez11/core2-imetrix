const jwt = require('jsonwebtoken');

//verificar token

let verificarToken = (req,res,next) =>{

    let token = req.get('Authorization');

    jwt.verify(token,"privateClaveINternas2021", (err,decoded)=>{
        if(err){
            return res.json({
                status:401,
                mensaje:"El token de autorizacion no es valido"
            })
        }

        req.usuario = decoded.usuario;

        next();
    })
}

module.exports = {
    verificarToken
}