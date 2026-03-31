import { useState } from 'react';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';
import api from '../api/axios';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState('llama-3.3-70b-versatile');

    const sendMessage = async () => {
        if (!input.trim()) return;

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
            setMessages([...updatedMessages, aiMessage]);
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
                    style={{opacity: (loading || !input) ? 0.6 : 1 }}
                    onClick={async()=>sendMessage()}
                    disabled={loading || !input}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
}
