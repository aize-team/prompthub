import Link from 'next/link';
import { PromptDetail } from '@/lib/prompt-data'; // Import the detailed type
import { Badge } from './ui/badge'; // Assuming badge is in ui folder

// Update the props to use PromptDetail
interface PromptCardProps {
  prompt: PromptDetail;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  // Defensive: tags normalization is handled inline in the JSX
  return (
  <Link href={`/prompt/${prompt.id}`} passHref>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-[1.03] overflow-hidden cursor-pointer group h-full flex flex-col justify-between border border-transparent hover:border-purple-300 dark:hover:border-purple-700">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
          {prompt.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
          {prompt.content}
        </p>
         {/* Display Tags */}
        {(() => {
          let tags: string[] = [];
          if (Array.isArray(prompt.tags)) {
            tags = prompt.tags;
          } else if (typeof prompt.tags === 'string') {
            tags = prompt.tags.split(',').map(t => t.trim()).filter(Boolean);
          }
          // Always operate on tags as an array
          return tags.length > 0 ? (
            <div className="flex flex-wrap gap-1 mb-3">
              {(tags.slice(0, 3)).map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">...</Badge>
              )}
            </div>
          ) : null;
        })()}
      </div>
      <div className="px-6 pb-4 pt-2 border-t border-gray-100 dark:border-gray-700 mt-auto">
        <span className="inline-block bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900 text-purple-800 dark:text-purple-200 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full group-hover:from-purple-500 group-hover:to-indigo-500 group-hover:text-white dark:group-hover:text-white transition-all duration-300">
          View Details
        </span>
      </div>
    </div>
  </Link>
  );
};

export default PromptCard;
