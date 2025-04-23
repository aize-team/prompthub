import { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getPromptById, allPrompts, PromptDetail } from '@/lib/prompt-data'; // Import allPrompts
import { notFound } from 'next/navigation'; // Import notFound for cleaner handling

interface PromptDetailPageProps {
  params: Promise<{
    id: string; // Parameter name should match the folder name [id]
  }>;
}

// Generate static params for all possible prompt IDs
export function generateStaticParams() {
  return allPrompts.map((prompt) => ({
    id: prompt.id,
  }));
}

// Function to generate metadata dynamically
export async function generateMetadata({
  params,
}: PromptDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const prompt = getPromptById(id);

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${prompt.title} | Prompt Detail`,
    description: `Details for the AI prompt: ${prompt.title}`,
  };
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  const { id } = await params; // Await and destructure the id from params
  const prompt = getPromptById(id); // Fetch prompt using the centralized function

  // If prompt not found, use Next.js notFound function to render 404 page
  if (!prompt) {
    notFound();
  }

  return (
    <div className="container mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[calc(100vh-200px)]">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">{prompt.title}</h1>

      {/* Added a copy button (functional component needed) */}
      <div className="relative mb-6">
        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap overflow-x-auto">
          <code>{prompt.content}</code>
        </pre>
        {/* TODO: Add a functional copy button here */}
        <button className="absolute top-2 right-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-xs font-semibold py-1 px-2 rounded">
          Copy
        </button>
      </div>

      <Separator className="my-8 bg-gray-200 dark:bg-gray-700" />

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800 dark:text-gray-200">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Use Cases:</h3>
            {prompt.useCases && prompt.useCases.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {prompt.useCases.map((useCase, index) => (
                  <li key={index} className="text-sm">{useCase}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">Not specified</p>
            )}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Category:</h3>
            <p className="text-sm">{prompt.category || 'Uncategorized'}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Tags:</h3>
            {prompt.tags && prompt.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No tags</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
