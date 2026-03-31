import {Router} from "express";
import protect from "../middleware/authMiddleware.js";
import Conversation from "../models/conversation.js";

const router = new Router();

router.get('/', protect, async(req,res)=>{
    try{
        const conversations = await Conversation.find({userId : req.user.id}).sort({createdAt : -1}).select('title messages model');
        res.send(conversations);
    } catch(err){
        console.log(err);
        res.status(500).send({error : err.message});
    }
});

router.get('/:id', protect, async(req,res)=>{
    try{
        const conversation = await Conversation.findOne({
            _id: req.params.id,
            userId : req.user.id,
        });
        if(!conversation){
            res.status(404).send({error : "Conversation pas trouvée !"});
        }
        res.status(200).send(conversation);
    }catch(err){
        res.status(500).send({error : err.message});
    }
});


router.post('/', protect, async(req,res)=>{
    try{
        const conversation = await Conversation.create({
            userId : req.user.id,
            title : 'Nouvelle conversation',
            messages : [],
            model : req.body.model || 'llama-3.3-70b-versatile',
        });
        res.status(201).send(conversation);
    }catch(err){
        res.status(500).send({error : err.message});
    }
});

router.put('/:id', protect, async(req, res)=>{
    const {messages, title} = req.body;
    try{
        const conversation = await Conversation.findOneAndUpdate(
            {_id: req.params.id, userId : req.user.id},
            {messages, title},
            {new : true}
        );
        if(!conversation){
            res.status(404).send({error : "Conversation introuvable !"});
        }
        res.status(200).send(conversation);
    } catch(err){
        res.status(500).send({error : err.message});
    }
});

router.delete('/:id', protect, async(req, res)=>{
    try{
        await Conversation.findOneAndDelete({_id: req.params.id, userId : req.user.id});
        res.json({message : "Conversation supprimée !"});
    } catch(err){
        res.status(500).send({error : err.message});
    }
});

export default router;