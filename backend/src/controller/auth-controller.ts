import User from '../models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import type { Request ,Response } from 'express';
import { JWT_TOKEN_KEY } from '../config/config';

export const registerUser = async (req : Request, res : Response)=>{
    try {
        const {name , email , password , role} = req.body;

        const checkExistingUser =  await User.findOne({email});

        if(checkExistingUser){
            return res.status(400).json({
                success : false,
                message : "Email already used , Please try new email"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        const newlyCreatedUser = await User.create({
            name ,
            email ,
            password : hashedPassword,
            role
        })

        if(newlyCreatedUser){
            return res.status(201).json({
                success : true,
                message : "User registered successfully",
                newlyCreatedUser
            })
        }

        return res.status(500).json({
            success : false,
            message : "User registration failed"
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success : false,
            message : 'Registration failed , Internal server error'
        })
    }
}

export const loginUser = async (req :Request ,res: Response)=>{
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                success : false,
                message : "email not found "
            })
        }

        const checkPassword = await bcrypt.compare(password , user.password);

        if(!checkPassword){
            return res.status(400).json({
                success : false,
                message : 'Password is incorrect'
            })
        }

        const accessToken = jwt.sign({
            userId : user._id,
            name : user.name,
            role : user.role
        },JWT_TOKEN_KEY,{
            expiresIn : '15h'
        })

        return res.status(200).json({
            success : true,
            message : "User logged-in",
            accessToken
        })
    }
    catch(e){
        return res.status(500).json({
            success : false,
            message : 'Internal server error'
        })
    }
}