import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { streamWeatherAgentResponse } from './services/weatherApi';

const THREAD_ID = 12345; // Replace with your ID

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState('light');
    const messagesEndRef = useRef(null);

    // Effect to set theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        setTheme(savedTheme);
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleClearChat = () => {
        setMessages([]);
        setError(null);
    };

    const handleDownloadChat = () => {
        const formattedChat = messages.map(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sender = msg.role === 'user' ? 'You' : 'Weather Agent';
            return `[${time}] ${sender}: ${msg.content}`;
        }).join('\n\n');

        const blob = new Blob([formattedChat], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'weather-chat-history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text) => {
        if (isLoading) return;
        
        setIsLoading(true);
        setError(null);
        
        const newUserMessage = {
            id: Date.now(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        };
        const updatedMessagesForUI = [...messages, newUserMessage];
        setMessages(updatedMessagesForUI);

        const agentMessageId = Date.now() + 1;
        setMessages(prev => [...prev, {
            id: agentMessageId,
            role: 'agent',
            content: '',
            timestamp: new Date(),
            isLoading: true,
        }]);

        await streamWeatherAgentResponse({
            // FIXED: Filter the history to ONLY send messages with role: 'user' to the API.
            // The UI will still show the full conversation.
            messages: updatedMessagesForUI.filter(msg => msg.role === 'user'),
            threadId: THREAD_ID,
            onChunk: (chunk) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === agentMessageId
                        ? { ...msg, content: msg.content + chunk }
                        : msg
                ));
            },
            onComplete: () => {
                setIsLoading(false);
                setMessages(prev => prev.map(msg => 
                    msg.id === agentMessageId ? { ...msg, isLoading: false } : msg
                ));
            },
            onError: (err) => {
                setIsLoading(false);
                // Update the UI with a custom error message that matches the design
                setError(`An error occurred: API Error: 500 . Please try again.`);
                setMessages(prev => prev.filter(msg => msg.id !== agentMessageId));
            },
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white font-sans dark:bg-zinc-900">
            <Header
                theme={theme}
                onToggleTheme={toggleTheme}
                onDownloadChat={handleDownloadChat}
                onClearChat={handleClearChat}
            />
            
            <main className="flex-grow overflow-y-auto pt-4 pb-48">
                <div className="max-w-4xl mx-auto px-4 space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {error && (
                      <div className="text-center text-red-600 text-sm p-4 bg-red-100 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                        {error}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80">
                <div className="p-4">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                </div>
            </footer>
        </div>
    );
}

export default App;