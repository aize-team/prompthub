'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[] | string;
  createdAt?: { seconds: number; nanoseconds: number };
  [key: string]: any;
}

interface PromptHistorySidebarProps {
  onSelectPrompt: (prompt: Prompt) => void;
}

const PromptHistorySidebar: React.FC<PromptHistorySidebarProps> = ({ onSelectPrompt }) => {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch user prompts
  const fetchUserPrompts = useCallback(async () => {
    if (!session) return;

    try {
      setIsLoading(true);
      setError('');

      const response = await fetch('/api/prompts/user');

      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }

      const data = await response.json();
      setPrompts(data);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError('Failed to load your prompt history');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // Fetch prompts on component mount and when session changes
  useEffect(() => {
    if (session) {
      fetchUserPrompts();
    }
  }, [session, fetchUserPrompts]);

  // Handle prompt selection
  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt);
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">Your Prompts</h2>
        <button
          onClick={fetchUserPrompts}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {!session ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to view your prompt history
          </p>
          <button
            onClick={openModal}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Sign In
          </button>
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 dark:text-red-400 text-sm p-4">
          {error}
        </div>
      ) : prompts.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm p-4">
          You haven't created any prompts yet
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2">
          {prompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => handleSelectPrompt(prompt)}
              className="w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {prompt.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {prompt.content}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                {prompt.category && (
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {prompt.category}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {prompt.createdAt ? new Date(prompt.createdAt.seconds * 1000).toLocaleDateString() : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptHistorySidebar;
