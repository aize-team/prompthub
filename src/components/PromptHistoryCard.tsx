import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface PromptHistoryCardProps {
    prompt: {
        id: string;
        title: string;
        content: string;
        category?: string;
        tags?: string[] | string;
        user_id?: string;
        user_details?: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
        createdAt?: { seconds: number; nanoseconds: number };
    };
    onSelect: (prompt: any) => void;
}

const PromptHistoryCard: React.FC<PromptHistoryCardProps> = ({ prompt, onSelect }) => {
    // Format the date if available
    const formattedDate = prompt.createdAt
        ? formatDistanceToNow(new Date(prompt.createdAt.seconds * 1000), { addSuffix: true })
        : 'Recently';

    // Get tags as array
    const tagsArray = typeof prompt.tags === 'string'
        ? prompt.tags.split(',').map((t: string) => t.trim())
        : Array.isArray(prompt.tags) ? prompt.tags : [];

    // Get user's display name or fallback
    const userName = prompt.user_details?.name || 'You';

    return (
        <div
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelect(prompt)}
        >
            <h3 className="font-medium text-gray-900 dark:text-white mb-1 text-sm line-clamp-1">
                {prompt.title}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-xs mb-2 line-clamp-2">
                {prompt.content}
            </p>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    {tagsArray.slice(0, 2).map((tag: string, i: number) => (
                        <span
                            key={i}
                            className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-xs px-2 py-0.5 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                    {tagsArray.length > 2 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                            +{tagsArray.length - 2}
                        </span>
                    )}
                </div>

                <span className="text-gray-500 dark:text-gray-400 text-xs">
                    {formattedDate}
                </span>
            </div>
        </div>
    );
};

export default PromptHistoryCard; 