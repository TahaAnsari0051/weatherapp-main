import React, { useState, useRef, useEffect } from 'react';
import { SendArrowIcon } from './icons/SendArrowIcon';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [text]);

    const handleSubmit = () => {
        if (text.trim() && !disabled) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className={`bg-white rounded-2xl border ${disabled ? 'border-zinc-200' : 'border-zinc-300'} shadow-lg dark:bg-zinc-900 dark:border-zinc-700`}>
                <div className="p-4 flex flex-col">
                    <textarea
                        ref={textareaRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="What's the weather in..."
                        rows={1}
                        className="w-full bg-transparent text-base text-zinc-900 placeholder-zinc-500 resize-none focus:outline-none overflow-y-hidden dark:text-zinc-100 dark:placeholder-zinc-400 disabled:bg-zinc-50 dark:disabled:bg-zinc-800"
                        style={{ lineHeight: '24px', minHeight: '24px', maxHeight: '120px' }}
                        disabled={disabled}
                    />
                    <div className="flex justify-end items-center h-10 mt-2">
                        <button
                            onClick={handleSubmit}
                            className="w-10 h-10 flex items-center justify-center bg-black rounded-xl hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                            disabled={!text.trim() || disabled}
                        >
                            <SendArrowIcon className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;