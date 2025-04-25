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
    <div className="min-h-[calc(100vh-200px)]">
      {/* Hero section with gradient background */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/30 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{prompt.title}</h1>
            
            {/* Tags display */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {prompt.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-3 py-1 rounded-full shadow-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Category and metadata */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{prompt.category || 'Uncategorized'}</span>
              </div>
              <span className="mx-3">•</span>
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Added recently</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Main content section */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Prompt content with copy button */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-12">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-1">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900/50 px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">AI Prompt</span>
                  </div>
                  <button className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 text-sm font-medium flex items-center gap-1 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
                <pre className="bg-white dark:bg-gray-800 p-6 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap overflow-x-auto text-sm font-mono">
                  {prompt.content}
                </pre>
              </div>
            </div>
            
            {/* Details section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Use Cases */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">Use Cases</h3>
                  </div>
                  
                  {prompt.useCases && prompt.useCases.length > 0 ? (
                    <ul className="space-y-2 pl-4">
                      {prompt.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 dark:text-blue-400 mr-2">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No specific use cases provided for this prompt.</p>
                  )}
                </div>
                
                {/* How to Use */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">How to Use</h3>
                  </div>
                  
                  <ol className="space-y-4">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm mr-3">1</span>
                      <span className="text-gray-700 dark:text-gray-300">Copy the prompt using the copy button above</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm mr-3">2</span>
                      <span className="text-gray-700 dark:text-gray-300">Paste it into your preferred AI platform</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium text-sm mr-3">3</span>
                      <span className="text-gray-700 dark:text-gray-300">Customize the prompt as needed for your specific requirements</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* Related prompts section - placeholder for future implementation */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Similar Prompts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allPrompts.slice(0, 3).map((relatedPrompt) => (
                  relatedPrompt.id !== prompt.id && (
                    <a key={relatedPrompt.id} href={`/prompt/${relatedPrompt.id}`} className="block group">
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800/50">
                        <div className="p-5">
                          <h3 className="font-semibold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {relatedPrompt.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{relatedPrompt.content}</p>
                          {relatedPrompt.tags && relatedPrompt.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {relatedPrompt.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
