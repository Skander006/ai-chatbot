import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Nouvelle conversation' },
    messages: [messageSchema],
    model: { type: String, default: 'llama-3.3-70b-versatile' },
}, { timestamps: true });

export default mongoose.model('Conversation', conversationSchema);