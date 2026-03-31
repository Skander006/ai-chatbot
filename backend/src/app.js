import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import conversationRoutes from "./routes/conversations.js";

const app = express();

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationRoutes);

app.get("/health", (req, res) =>{
    res.json({status : "ok"});
});

const PORT = process.env.PORT || 2525;
app.listen(PORT, ()=>{
    console.log(`Serveur tourne sur le port ${PORT}...`);
});