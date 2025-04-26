'use client'; // This page needs client-side interactivity for filtering

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { allPrompts, getAllTags } from '@/lib/prompt-data';
import PromptCard from '@/components/PromptCard';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';

// Create a client component that uses useSearchParams
function ExploreContent() {
  const searchParams = useSearchParams();
  const searchFromParams = searchParams.get('search') || '';
  const { t, direction } = useLanguage();

  const [searchTerm, setSearchTerm] = useState(searchFromParams);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(), []); // Get all unique tags once

  // Update search term when URL parameters change
  useEffect(() => {
    setSearchTerm(searchFromParams);

    // If the search term matches a tag exactly, select that tag
    if (searchFromParams) {
      const matchingTag = allTags.find(
        tag => tag.toLowerCase() === searchFromParams.toLowerCase()
      );
      if (matchingTag) {
        setSelectedTag(matchingTag);
      }
    }
  }, [searchFromParams, allTags]);

  const filteredPrompts = useMemo(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return allPrompts.filter(prompt => {
      const matchesSearch = lowerSearchTerm === '' ||
        prompt.title.toLowerCase().includes(lowerSearchTerm) ||
        prompt.content.toLowerCase().includes(lowerSearchTerm) ||
        prompt.category.toLowerCase().includes(lowerSearchTerm) ||
        prompt.useCases.some(uc => uc.toLowerCase().includes(lowerSearchTerm)) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm));

      const matchesTag = selectedTag === null || prompt.tags.map(t => t.toLowerCase()).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null); // Deselect if clicking the same tag
    } else {
      setSelectedTag(tag);
    }
  };

  return (
    <div className={`container mx-auto p-6 min-h-screen ${direction === 'rtl' ? 'rtl' : ''}`}>
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        {t('explore.title') || 'Explore Prompts'}
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Search Input */}
          <div className="md:col-span-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('explore.search-label')}</label>
            <Input
              id="search"
              type="text"
              placeholder={t('explore.search-placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Tag Filter */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('explore.filter-by-tag')}</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTag === null ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                {t('explore.all-tags')}
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors capitalize ${selectedTag === tag ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Prompt Grid */}
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-400">{t('explore.no-prompts')}</p>
          {searchTerm && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{t('explore.broaden-search')}</p>}
        </div>
      )}
    </div>
  );
}

// Loading component for Suspense fallback
function ExploreLoading() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        {t('explore.title') || 'Explore Prompts'}
      </h1>
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 dark:bg-blue-600 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}

// Main export function that wraps the client component with Suspense
export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreContent />
    </Suspense>
  );
}
