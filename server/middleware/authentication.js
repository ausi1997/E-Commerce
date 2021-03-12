const jwt = require('jsonwebtoken');  // importin jwt module


const requireSignIn = async(req,res,next)=>{
    try{
        const token = await req.headers.authorization.split(' ')[1];
        const decode = jwt.verify(token, 'verySecretValue');

        req.user = decode
        next();
    }
    catch(error){
          return res.json({
              status:false,
              message:'authentication failed....'
          });
    }
}
/*const adminMiddleware = (req,res,next)=>{
    if(req.result.role !== 'admin'){
        return res.json({
            message:'Access denied'
        });
    }
    next();
}*/

module.exports = requireSignIn;

//module.exports = adminMiddleware;