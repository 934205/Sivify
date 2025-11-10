const jwt=require("jsonwebtoken")
require("dotenv").config()

function verifyToken(req,res,next){
    const token=req.cookies.token

    if(!token){
        return res.status(401).json({
            success:false,
            message:"unauthorized access no token found"
        })
    }

    const user=jwt.verify(token,process.env.JSON_SECRET,(err,data)=>{        
    
        if(err){
            return res.status(403).json({
                success:false,
                message:"invalid or expired token",
            })
        }        
        req.user=data
        next()
    })
}

module.exports=verifyToken