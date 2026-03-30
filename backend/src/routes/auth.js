import express from "express";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({error : "Identifiants requis"});
    }

    try{
        const user = await User.create({email, password});
        const token = jwt.sign(
            {id : user._id, email : user.email},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "7d"}
        );
        res.status(201).json({token, user:{id : user._id, email : user.email}});
    } catch(err){
        if(err.code === 11000){
            return res.status(409).json({error : "Email existant déjà !"});
        }
        res.status(500).json({error : `${err.message}`});
    }
});


router.post("/login", async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({error : "Identifiants incorrects"});
        }
        const valid = await user.comparePassword(password);
        if(!valid){
            return res.status(401).json({error : "Identifiants incorrects"});
        }

        const token = jwt.sign(
            {id : user._id, email : user.email},
            process.env.JWT_SECRET_KEY,
            {expiresIn : "7d"}
        );

        res.status(200).json({token, user: {id: user._id, email: user.email}});
    } catch(err){
        res.status(500).json({error : `${err.message}`});
    }
});

export default router;