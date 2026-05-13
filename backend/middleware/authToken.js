const jwt = require('jsonwebtoken')

async function authToken(req,res,next){
    try{
        const token = req.cookies?.token

        if(!token){
            return res.status(401).json({
                message : "Please Login...!",
                error : true,
                success : false
            })
        }

        jwt.verify(token, process.env.TOKEN_SECRET_KEY, function(err, decoded) {
            if(err){
                return res.status(401).json({
                    message : "Invalid or expired token",
                    error : true,
                    success : false
                })
            }

            if (!decoded?._id) {
                return res.status(401).json({
                    message : "Invalid authentication payload",
                    error : true,
                    success : false
                })
            }

            // Store the authenticated identity from the verified JWT only.
            // Controllers must not trust user IDs supplied through URL params.
            req.user = {
                id: decoded._id,
                email: decoded.email
            }
            req.userId = decoded._id
            next()
        });


    }catch(err){
        res.status(401).json({
            message : err.message || err,
            data : [],
            error : true,
            success : false
        })
    }
}


module.exports = authToken
