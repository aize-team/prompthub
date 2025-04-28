import React, { useState, useEffect, useCallback } from 'react';
import PromptHistoryCard from './PromptHistoryCard';
import { useSession } from 'next-auth/react';

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
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastRefreshed, setLastRefreshed] = useState(Date.now());

    // Make fetchUserPrompts callable from outside
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
    }, [session, fetchUserPrompts, lastRefreshed]);

    // Method to manually refresh the prompts
    const refreshPrompts = () => {
        setLastRefreshed(Date.now());
    };

    // Expose the refresh method to the window object
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).refreshPromptHistory = refreshPrompts;
        }

        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).refreshPromptHistory;
            }
        };
    }, []);

    if (!session) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-full">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Sign in to view your prompt history
                </p>
            </div>
        );
    }

    return (
        <div
            className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-full overflow-hidden flex flex-col"
            data-prompt-history-sidebar
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Your Prompt History
                </h2>
                <button
                    onClick={refreshPrompts}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
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

            {isLoading ? (
                <div className="flex items-center justify-center flex-1">
                    <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 dark:text-red-400 text-sm p-4">
                    {error}
                </div>
            ) : prompts.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm p-4 flex-1">
                    You haven't created any prompts yet
                </div>
            ) : (
                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                    {prompts.map(prompt => (
                        <PromptHistoryCard
                            key={prompt.id}
                            prompt={prompt}
                            onSelect={onSelectPrompt}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PromptHistorySidebar; 