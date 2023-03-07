const jwt = require("jsonwebtoken")


const checkAuthUser = async (req,res,next)=>  {
    const {authorization} = req.headers;
    try{
        if(authorization.startsWith("Bearer")){
           let token = authorization.split(" ")[1];
            const auth = jwt.verify(token,process.env.SCERET_KEY) 
            console.log("token");   
            next();
        }else{
            res.json({
                status : 401,
                message : "Authorization is Empty or Bearer"
            })
        }
    }catch(error){
        res.json({
            status : 400,
            message : error.message
        })
    }
}

module.exports = checkAuthUser