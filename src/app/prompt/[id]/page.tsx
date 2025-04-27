'use client';

import { useState, useEffect } from 'react';
import { getPromptById, PromptDetail } from '@/lib/prompt-data'; // Import async fetch function
import { notFound } from 'next/navigation';
import PromptDetailContent from '@/components/PromptDetailContent';
import { useLanguage } from '@/context/LanguageContext';

// Loading component (can reuse or create a specific one)
function PromptDetailLoading() {
  const { t } = useLanguage();
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        {t('promptDetail.title') || 'Prompt Details'}
      </h1>
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-purple-400 dark:bg-purple-600 rounded-full mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
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
      <div className="container mx-auto p-6 min-h-screen text-center text-red-500">
        <h1 className="text-4xl font-bold mb-8">{t('promptDetail.title') || 'Prompt Details'}</h1>
        <p>{error}</p>
      </div>
    );
  }

  // If prompt is still null/undefined after loading (should be caught by notFound, but as a fallback)
  if (!prompt) {
    return (
      <div className="container mx-auto p-6 min-h-screen text-center text-red-500">
        <h1 className="text-4xl font-bold mb-8">{t('promptDetail.title') || 'Prompt Details'}</h1>
        <p>Prompt not found.</p>
      </div>
    );
  }

  return <PromptDetailContent prompt={prompt} />;
}

// Note: generateStaticParams and generateMetadata cannot be used directly
// in a Client Component's file. For SEO and static generation, you might
// need a separate Server Component wrapper or alternative strategies.
// Removing generateStaticParams as data is now fetched client-side dynamically.

// You would typically handle metadata in a layout.tsx or a separate server component
// for this route if you need dynamic, server-rendered metadata.
// Example of how metadata could potentially be handled in a Server Component layout:
/*
// src/app/prompt/[id]/layout.tsx (Server Component)
import { Metadata } from 'next';
import { getPromptById } from '@/lib/prompt-data'; // Assuming getPromptById can also work server-side or you have a server-side fetching equivalent

export async function generateMetadata(props: any): Promise<Metadata> {
  const params = props.params;
  const id = params.id;
  // This part still needs to fetch data, ideally server-side for performance/SEO
  // If getPromptById is only client-side, you'd need a different server-side fetch here.
  const prompt = await getPromptById(id);

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

export default function PromptDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
*/