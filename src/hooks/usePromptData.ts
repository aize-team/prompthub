import { useState, useEffect, useCallback } from 'react';
import { PromptDetail, PromptTag } from '@/lib/prompt-data';

// Type for our cache store
type CacheStore<T> = {
  data: T | null;
  timestamp: number;
  loading: boolean;
  error: Error | null;
};

// Global cache objects
const promptsCache: CacheStore<PromptDetail[]> = {
  data: null,
  timestamp: 0,
  loading: false,
  error: null,
};

const tagsCache: CacheStore<PromptTag[]> = {
  data: null,
  timestamp: 0,
  loading: false,
  error: null,
};

// Cache expiration time (in milliseconds) - 5 minutes
const CACHE_EXPIRATION = 5 * 60 * 1000;

/**
 * Custom hook for fetching and caching prompt data with lazy loading
 */
export function usePromptData() {
  const [prompts, setPrompts] = useState<PromptDetail[]>([]);
  const [tags, setTags] = useState<PromptTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if cache is valid
  const isCacheValid = (cache: CacheStore<any>) => {
    return (
      cache.data !== null &&
      Date.now() - cache.timestamp < CACHE_EXPIRATION
    );
  };

  // Fetch prompts with caching
  const fetchPromptsWithCache = useCallback(async () => {
    // If we're already loading, don't start another request
    if (promptsCache.loading) return;

    // If cache is valid, use it
    if (isCacheValid(promptsCache)) {
      setPrompts(promptsCache.data!);
      setLoading(false);
      return;
    }

    // Mark as loading
    promptsCache.loading = true;
    setLoading(true);

    try {
      // Fetch from Firebase API endpoint
      const apiResponse = await fetch('/api/prompts', {
        // Add cache control headers to prevent browser caching
        // We want to control caching in our application
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!apiResponse.ok) {
        throw new Error(`Failed to fetch prompts. Status: ${apiResponse.status}`);
      }
      
      const data = await apiResponse.json();
      
      // Update cache
      promptsCache.data = data;
      promptsCache.timestamp = Date.now();
      promptsCache.error = null;
      
      setPrompts(data);
      console.log(`Cached ${data.length} prompts at ${new Date().toLocaleTimeString()}`);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching prompts');
      promptsCache.error = error;
      setError(error);
      console.error('Error fetching prompts:', error);
    } finally {
      promptsCache.loading = false;
      setLoading(false);
    }
  }, []);

  // Fetch tags with caching
  const fetchTagsWithCache = useCallback(async () => {
    // If we're already loading, don't start another request
    if (tagsCache.loading) return;

    // If cache is valid, use it
    if (isCacheValid(tagsCache)) {
      setTags(tagsCache.data!);
      return;
    }

    // If we have prompts data, extract tags from it
    if (promptsCache.data) {
      const tagSet = new Set<PromptTag>();
      promptsCache.data.forEach(prompt => {
        prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
      });
      const uniqueTags = Array.from(tagSet).sort();
      
      // Update cache
      tagsCache.data = uniqueTags;
      tagsCache.timestamp = Date.now();
      tagsCache.error = null;
      
      setTags(uniqueTags);
      return;
    }

    // Mark as loading
    tagsCache.loading = true;

    try {
      // Fetch all prompts and extract tags
      await fetchPromptsWithCache();
      
      if (promptsCache.data) {
        const tagSet = new Set<PromptTag>();
        promptsCache.data.forEach(prompt => {
          prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
        });
        const uniqueTags = Array.from(tagSet).sort();
        
        // Update cache
        tagsCache.data = uniqueTags;
        tagsCache.timestamp = Date.now();
        tagsCache.error = null;
        
        setTags(uniqueTags);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error fetching tags');
      tagsCache.error = error;
      setError(error);
      console.error('Error fetching tags:', error);
    } finally {
      tagsCache.loading = false;
    }
  }, [fetchPromptsWithCache]);

  // Function to get a specific number of prompts (lazy loading)
  const getPrompts = useCallback(
    async (count: number, offset: number = 0, sortBy?: string) => {
      if (!promptsCache.data && !loading) {
        await fetchPromptsWithCache();
      }

      if (promptsCache.data) {
        let sortedPrompts = [...promptsCache.data];
        
        // Apply sorting if specified
        if (sortBy === 'popular') {
          sortedPrompts.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === 'recent') {
          // Assuming we'd have a date field, for now just randomize
          sortedPrompts.sort(() => 0.5 - Math.random());
        }
        
        return sortedPrompts.slice(offset, offset + count);
      }
      
      return [];
    },
    [fetchPromptsWithCache, loading]
  );

  // Function to get tags with limit
  const getTags = useCallback(
    async (count: number) => {
      if (!tagsCache.data && !loading) {
        await fetchTagsWithCache();
      }

      if (tagsCache.data) {
        return tagsCache.data.slice(0, count);
      }
      
      return [];
    },
    [fetchTagsWithCache, loading]
  );

  // Initialize data loading
  useEffect(() => {
    if (!promptsCache.data && !promptsCache.loading) {
      fetchPromptsWithCache();
    } else if (isCacheValid(promptsCache)) {
      setPrompts(promptsCache.data!);
      setLoading(false);
    }

    if (!tagsCache.data && !tagsCache.loading) {
      fetchTagsWithCache();
    } else if (isCacheValid(tagsCache)) {
      setTags(tagsCache.data!);
    }
  }, [fetchPromptsWithCache, fetchTagsWithCache]);

  return {
    prompts,
    tags,
    loading,
    error,
    getPrompts,
    getTags,
    refreshPrompts: fetchPromptsWithCache,
    refreshTags: fetchTagsWithCache,
  };
}
