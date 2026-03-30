import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';

export default function ChatWindow({ messages, loading }) {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    return (
        <div className="flex justify-center items-center mx-auto">
            <div className="chat-window">
                {messages.length === 0 && (
                    <p className="empty-message">Commence une conversation ! 👋</p>
                )}
                {messages.map((msg, i) => (
                    <MessageBubble key={i} message={msg} />
                ))}
                {loading && (
                    <div className="typing">
                        <span className="dot" />
                        <span className="dot" />
                        <span className="dot" />
                    </div>
                )}
                <div ref={bottomRef} />
            </div>
        </div>

    );
}
