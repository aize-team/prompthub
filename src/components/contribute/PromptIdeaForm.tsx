'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

interface PromptIdeaFormProps {
  onSuccess?: (promptId: string) => void;
}

const PromptIdeaForm = ({ onSuccess }: PromptIdeaFormProps) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [promptIdea, setPromptIdea] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!promptIdea.trim()) {
      setError(t('generate.error-empty'));
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/process-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptIdea }),
      });

      if (!response.ok) {
        throw new Error(t('generate.error-processing'));
      }

      const data = await response.json();

      // Prepare the data for the prompt
      const promptData = {
        title: data.title || '',
        content: data.content || '',
        tags: data.tags || '',
        category: data.category || '',
        model: data.model || '',
        promptType: data.promptType || '',
        complexityLevel: data.complexityLevel || '',
        useCases: Array.isArray(data.useCases) ? data.useCases : [],
        example: data.exampleOutput || data.example || '',
        tips: data.tips || '',
        expectedResponse: data.expectedResponse || '',
      };
      
      // Save the prompt to the database
      const saveResponse = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData),
      });

      if (!saveResponse.ok) {
        throw new Error(t('contribute.save-fail'));
      }

      const savedData = await saveResponse.json();
      const promptId = savedData.id;

      // Redirect to the edit page with the prompt ID
      if (onSuccess) {
        onSuccess(promptId);
      } else {
        router.push(`/contribute/edit/${promptId}`);
      }

    } catch (error) {
      console.error('Error processing prompt:', error);
      setError(typeof error === 'string' ? error : t('generate.error-processing'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background blobs with more vibrant colors and varied sizes */}
        <div className="absolute -top-1/2 -left-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-300 to-purple-300 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-full opacity-40 dark:opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] bg-gradient-to-r from-blue-300 to-cyan-300 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full opacity-40 dark:opacity-15 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full opacity-40 dark:opacity-15 animate-blob"></div>
        
        {/* Additional smaller animated elements */}
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-gradient-to-r from-amber-200 to-yellow-200 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full opacity-30 dark:opacity-10 animate-float animation-delay-3000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-[150px] h-[150px] bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full opacity-30 dark:opacity-10 animate-float animation-delay-1000"></div>
        
        {/* Particle effect */}
        <div className="particles-container absolute inset-0 z-0"></div>
      </div>

      <div className="relative w-full max-w-3xl mx-auto z-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_50px_-12px_rgba(79,70,229,0.15)] overflow-hidden border border-white/30 dark:border-gray-700/50 transition-all duration-500 hover:shadow-[0_20px_70px_-12px_rgba(79,70,229,0.3)] dark:hover:shadow-[0_20px_70px_-12px_rgba(79,70,229,0.2)] transform hover:scale-[1.01]">
          {/* Header with enhanced visual effects */}
          <div className="p-8 text-center relative">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/10 dark:to-purple-900/10 rounded-br-3xl opacity-50 -z-10"></div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100 to-cyan-100 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-bl-3xl opacity-50 -z-10"></div>
            
            {/* Icon with pulse effect */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-70 blur-md animate-pulse-slow"></div>
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transform transition-transform hover:scale-105 hover:rotate-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            
            {/* Animated title with enhanced gradient */}
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
              {t('contribute.step1.title')}
            </h1>
            
            {/* Subtitle with better styling */}
            <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
              {t('contribute.step1.subtitle')}
            </p>
            
            {/* Decorative dots */}
            <div className="flex justify-center mt-6 space-x-1">
              <span className="block w-2 h-2 rounded-full bg-indigo-500"></span>
              <span className="block w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="block w-2 h-2 rounded-full bg-pink-500"></span>
            </div>
          </div>

          {/* Main content */}
          <div className="px-8 pb-8">
            <div className="space-y-6">
              <div className="relative group">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-lg opacity-75 group-hover:opacity-100 blur-md transition-all duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                
                <div className="relative bg-white/95 dark:bg-gray-800/95 rounded-lg p-0.5 backdrop-blur-sm">
                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400 dark:bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-500"></div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={promptIdea}
                      onChange={(e) => setPromptIdea(e.target.value)}
                      placeholder={t('contribute.step1.placeholder')}
                      className="w-full p-6 pt-8 bg-white/70 dark:bg-gray-800/70 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none min-h-[180px] outline-none transition-all duration-200 backdrop-blur-sm"
                      rows={5}
                    />
                    
                    {/* Character counter */}
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {promptIdea.length} {t('contribute.step1.characters')}
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                  <svg className="flex-shrink-0 w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h.01a1 1 0 100-2H10V9z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleGenerate}
                  disabled={processing || !promptIdea.trim()}
                  className={`group relative flex-1 px-8 py-5 rounded-xl font-medium text-white transition-all duration-300 overflow-hidden ${
                    processing || !promptIdea.trim() 
                      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-indigo-500/30'
                  }`}
                >
                  {/* Button background animation */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"></div>
                  
                  {/* Button content */}
                  <div className="relative flex items-center justify-center">
                    {processing ? (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 relative">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-opacity-20 rounded-full animate-ping"></div>
                            <svg className="animate-spin absolute inset-0 h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                        </div>
                        <span className="font-bold text-lg ml-6 opacity-0 animate-pulse">{t('contribute.step1.processing')}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-lg mr-2 transform group-hover:translate-x-[-4px] transition-transform duration-300">{t('contribute.step1.button')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                  
                  {/* Button shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine"></div>
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {t('contribute.step1.tips.heading')}
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{t('contribute.step1.tips.specific')}</span>
                </li>
                <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{t('contribute.step1.tips.context')}</span>
                </li>
                <li className="flex items-start p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <svg className="flex-shrink-0 w-5 h-5 text-indigo-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>{t('contribute.step1.tips.tone')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Add the animation keyframes to the global styles */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
        }
        
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-shine {
          animation: shine 1.5s ease-in-out;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default PromptIdeaForm;
