import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function SideBar({ currentId, onSelect, onNew, onDelete, model }) {
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
            const res = await api.post('/conversations',{'model' : model});
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
        <div className="flex flex-2 min-h-screen flex-col gap-4 rounded-2xl shadow-xl text-white text-center">
            <div className="flex p-4 border-b border-gray-700">
                <button
                    onClick={handleNew}
                    className="w-full py-4 px-8 bg-indigo-500 hover:bg-indigo-600 cursor-pointer rounded-lg text-lg font-semibold transition-colors duration-250"
                >
                    + Nouvelle conversation
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                {conversations.length === 0 && (
                    <div className="flex justify-center items-center">
                        <p className="text-gray-500 text-center mt-4">
                            Aucune conversation
                        </p>
                    </div>
                )}
                {conversations.map(conv => (
                    <div
                        key={conv._id}
                        onClick={() => onSelect(conv._id)}
                        className={`rounded-lg cursor-pointer border-b border-b-gray-300 shadow-lg transition-all duration-200
                            ${currentId === conv._id
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-800 hover:bg-indigo-400'
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