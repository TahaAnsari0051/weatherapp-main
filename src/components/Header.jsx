import React from 'react';
import { Moon, Sun, Download, Trash2, CloudSun } from 'lucide-react';

const ActionButton = ({ onClick, children, ariaLabel, className = '' }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors ${className}`}
  >
    {children}
  </button>
);

const Header = ({ theme, onToggleTheme, onDownloadChat, onClearChat }) => {
  return (
    <header className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <CloudSun className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        <h1 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
          Weather Agent
        </h1>
      </div>
      <div className="flex items-center gap-1">
        <ActionButton 
          onClick={onToggleTheme} 
          ariaLabel="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </ActionButton>
        <ActionButton 
          onClick={onDownloadChat} 
          ariaLabel="Download chat history"
        >
          <Download size={20} />
        </ActionButton>
        <ActionButton 
          onClick={onClearChat} 
          ariaLabel="Clear chat history"
          className="text-red-500 hover:text-red-600 dark:hover:text-red-400"
        >
          <Trash2 size={20} />
        </ActionButton>
      </div>
    </header>
  );
};

export default Header;