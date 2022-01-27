const jwt = require('jsonwebtoken');

const checkToken = (req,res,next) => {
    const logintoken = req.headers.authorization
    if(logintoken){
        jwt.verify(logintoken,process.env.ACCESS_TOKEN,(err,decoded) => {
            req.user = decoded;
            next();
        })
    }else{
        res.send({
            msg:"You have to be logged in to perform this action"
        })
    }
}

module.exports = {
    checkToken
}