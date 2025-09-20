import React from 'react';
import ReactMarkdown from 'react-markdown';

// Typing indicator component (remains the same)
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
  </div>
);

const ChatMessage = ({ message }) => {
  const { role, content, timestamp, isLoading } = message;
  const isUser = role === 'user';

  const formattedTime = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  if (isUser) {
    return (
      <div className="flex flex-col items-end">
        <div 
          className={`
            px-4 py-3 max-w-xl md:max-w-2xl
            bg-gray-100 text-zinc-900 
            dark:bg-zinc-800 dark:text-zinc-200
            rounded-tl-2xl rounded-bl-2xl rounded-br-2xl
            border border-gray-200 dark:border-zinc-700
            shadow-sm
          `}
        >
          <p className="text-base">{content}</p>
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5 px-1">
          {formattedTime}
        </span>
      </div>
    );
  }

  // Agent messages are rendered as free-flowing markdown
  return (
    <div className="w-full flex flex-col items-start">
      {isLoading && !content ? (
        <TypingIndicator />
      ) : (
        <div className="prose prose-base prose-zinc dark:prose-invert max-w-none">
          <ReactMarkdown>{content || ''}</ReactMarkdown>
        </div>
      )}
      <span className="text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
        {formattedTime}
      </span>
    </div>
  );
};

export default ChatMessage;