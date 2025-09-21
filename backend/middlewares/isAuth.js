import  jwt from 'jsonwebtoken'

export const isAuth=async(req,res,next) => {
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedToken){
            return res.status(401).json({message:"token not verify"})
        }
        
        req.userId=decodedToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}