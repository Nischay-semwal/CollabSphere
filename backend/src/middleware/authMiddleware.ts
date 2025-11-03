import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_TOKEN_KEY } from '../config/config';
import type {NextFunction, Request, Response } from 'express';

interface decodedToken extends JwtPayload {
    userId : string,
    name : string, 
    role : string
}

export const authMiddleware = (req : Request, res :Response , next : NextFunction)=>{
    const authToken = req.headers["authorization"];

    const token = authToken && authToken.split(" ")[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message : "Access denied ! No token provided"
        })
    }

    try{
         const decodedTokenInfo = jwt.verify(token , JWT_TOKEN_KEY) as decodedToken;
         req.user = decodedTokenInfo;
         console.log(decodedTokenInfo);

         next();
    }
    catch(e){
            return res.status(403).json({
                success : false,
                message : 'Invalid token or session expired'
            })
    }
}