import { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';
import api from '../api/axios';
import SideBar from "../components/SideBar.jsx";

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState('llama-3.3-70b-versatile');
    const [conversationId, setConversationId] = useState(null);

    const loadConversation = async (id) => {
        try {
            const res = await api.get(`/conversations/${id}`);
            setMessages(res.data.messages);
            setModel(res.data.model);
            setConversationId(id);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNew = (conv) => {
        setConversationId(conv._id);
        setMessages([]);
    };

    const handleDelete = () => {
        setConversationId(null);
        setMessages([]);
    };

    const saveConversation = async (updatedMessages, title) => {
        if (!conversationId) return;
        try {
            await api.put(`/conversations/${conversationId}`, {
                messages: updatedMessages,
                title,
            });
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        let activeId = conversationId;
        if (!activeId) {
            try {
                const res = await api.post('/conversations', { model });
                activeId = res.data._id;
                setConversationId(activeId);
            } catch(err){
                console.error(err);
                return;
            }
        }
        const userMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', {
                messages: updatedMessages,
                model,
            });
            const aiMessage = res.data.message;
            const finalMessages = [...updatedMessages, aiMessage];
            setMessages(finalMessages);

            const title = userMessage.content.slice(0,40);
            await saveConversation(finalMessages, title);

        } catch (err) {
            setMessages([...updatedMessages, {
                role: 'assistant',
                content: 'Erreur : ' + (err.response?.data?.error || 'Problème serveur'),
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            await sendMessage();
        }
    };

    return (
        <div className="container-chat">
            <Navbar model={model} setModel={setModel} />
            <div className="flex justify-center items-center">
                <SideBar
                    currentId={conversationId}
                    onSelect={loadConversation}
                    onNew={handleNew}
                    onDelete={handleDelete}
                    model={model}
                />
                <div className="flex flex-col flex-7 justify-center gap-28">
                    <ChatWindow messages={messages} loading={loading} />
                    <div className="input-area">
                        <textarea
                            className="textarea"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Écris ton message..."
                            rows={2}
                        />
                        <button
                            className="send-btn"
                            style={{opacity: (loading || !input.trim()) ? 0.6 : 1 }}
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
