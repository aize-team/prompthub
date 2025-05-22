'use client';

import { useState, useEffect } from 'react';
import { getPromptById, PromptDetail } from '@/lib/prompt-data'; // Import async fetch function
import { notFound } from 'next/navigation';
import PromptDetailContent from '@/components/PromptDetailContent';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

// Loading component (can reuse or create a specific one)
function PromptDetailLoading() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        {t('promptDetail.title')}
      </h1>
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-purple-400 dark:bg-purple-600 rounded-full mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <p className="text-center text-gray-600 dark:text-gray-400">{t('promptDetail.loading')}</p>
    </div>
  );
}

// Main export function
export default function PromptDetailPage(props: any) {
  const params = props.params;
  const id = params.id;
  const { t } = useLanguage();

  const [prompt, setPrompt] = useState<PromptDetail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPrompt = await getPromptById(id);
        if (!fetchedPrompt) {
          notFound(); // Use Next.js notFound if prompt is null/undefined
        }
        setPrompt(fetchedPrompt);
      } catch (err) {
        console.error(`Error fetching prompt ${id}:`, err);
        setError('Failed to load prompt details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]); // Re-fetch if the ID changes

  if (loading) {
    return <PromptDetailLoading />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-8 text-red-600 dark:text-red-400">{t('promptDetail.title')}</h1>
        <p className="text-red-500 dark:text-red-400 mb-4">{t('promptDetail.errorLoading')}</p>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  // If prompt is still null/undefined after loading (should be caught by notFound, but as a fallback)
  if (!prompt) {
    return (
      <div className="container mx-auto p-6 min-h-screen text-center">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">{t('promptDetail.title')}</h1>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-8 rounded-lg max-w-2xl mx-auto">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium">{t('promptDetail.notFound')}</h3>
          <p className="mt-2 text-sm">
            {t('promptDetail.errorLoading')}
          </p>
          <div className="mt-6">
            <Link
              href="/explore"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {t('promptDetail.backToExplore')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <PromptDetailContent prompt={prompt} />;
}