import express from "express";
import Groq from "groq-sdk";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


const AVAILABLE_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
router.post("/",protect, async(req, res)=>{
    const {messages, model = 'llama-3.3-70b-versatile'} = req.body;
    if(!messages || !Array.isArray(messages)){
        return res.status(400).json({error : 'Messages requis'});
    }
    if(!AVAILABLE_MODELS.includes(model)){
        return res.status(400).json({error : 'Modèle non supporté'});
    }

    try{
        const groq = new Groq({apiKey: process.env.GROQ_API_KEY});
        const completions = await groq.chat.completions.create({
            model,
            messages,
            max_tokens : 1000
        });

        const reply = completions.choices[0].message;
        res.json({message : reply, model});
    } catch(err){
        console.log("Erreur serveur Groq !");
        res.status(500).json({error : `${err.message}`});
    }
});

export default router;