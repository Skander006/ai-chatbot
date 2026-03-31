import ReactMarkdown from 'react-markdown';

export default function MessageBubble({ message }) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex mb-3 items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isUser ? 'bg-indigo-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                {isUser ? 'U' : 'AI'}
            </div>

            <div className={`max-w-[70%] rounded-2xl shadow-sm p-4 leading-relaxed ${isUser ? 'bg-indigo-500 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'}`}>
                {isUser ? (
                    <p>{message.content}</p>
                ) : (
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                )}
            </div>
        </div>
    );
}