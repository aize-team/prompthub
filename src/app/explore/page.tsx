'use client'; // This page needs client-side interactivity for filtering

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { allPrompts, getAllTags, PromptDetail } from '@/lib/prompt-data';
import PromptCard from '@/components/PromptCard';
import { Input } from '@/components/ui/input'; // Assuming Input component exists
import { Badge } from '@/components/ui/badge';

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const searchFromParams = searchParams.get('search') || '';
  
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
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
        Explore Prompts
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Search Input */}
          <div className="md:col-span-1">
             <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Prompts</label>
             <Input
               id="search"
               type="text"
               placeholder="Search by title, content, tag..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full"
             />
          </div>

          {/* Tag Filter */}
          <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Tag</label>
             <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTag === null ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                All Tags
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
          <p className="text-xl text-gray-600 dark:text-gray-400">No prompts found matching your criteria.</p>
          {searchTerm && <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try broadening your search or clearing the filters.</p>}
        </div>
      )}
    </div>
  );
}
