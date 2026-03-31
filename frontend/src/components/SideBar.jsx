import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function SideBar({ currentId, onSelect, onNew, onDelete }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/conversations');
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleNew = async () => {
        try {
            const res = await api.post('/conversations');
            setConversations([res.data, ...conversations]);
            onNew(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/conversations/${id}`);
            setConversations(conversations.filter(c => c._id !== id));
            if (currentId === id) onDelete();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col w-64 h-full bg-gray-900 text-white shrink-0">
            <div className="p-4 border-b border-gray-700">
                <button
                    onClick={handleNew}
                    className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-semibold transition-colors"
                >
                    + Nouvelle conversation
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                {conversations.length === 0 && (
                    <p className="text-gray-500 text-sm text-center mt-4">
                        Aucune conversation
                    </p>
                )}
                {conversations.map(conv => (
                    <div
                        key={conv._id}
                        onClick={() => onSelect(conv._id)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors group
                            ${currentId === conv._id
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-300 hover:bg-gray-800'
                        }`}
                    >
                        <span className="truncate flex-1">{conv.title}</span>
                        <button
                            onClick={(e) => handleDelete(e, conv._id)}
                            className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity text-xs"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}