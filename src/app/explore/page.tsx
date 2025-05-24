'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  fetchPaginatedPrompts,
  getAllTags,
  PromptDetail,
  PromptTag,
  PaginatedResponse
} from '@/lib/prompt-data';
import PromptCard from '@/components/PromptCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';

// Create a client component that uses useSearchParams
function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, direction } = useLanguage();

  // Get query params
  const searchQuery = searchParams.get('search') || '';
  const tagQuery = searchParams.get('tag') || '';
  const categoryQuery = searchParams.get('category') || '';
  const sortByQuery = searchParams.get('sortBy') || 'latest';
  const pageQuery = parseInt(searchParams.get('page') || '1');

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [selectedTag, setSelectedTag] = useState<string | null>(tagQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryQuery);
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>(sortByQuery as 'latest' | 'popular');
  const [currentPage, setCurrentPage] = useState(pageQuery);

  // Data state
  const [data, setData] = useState<PaginatedResponse<PromptDetail>>({
    items: [],
    total: 0,
    page: 1,
    totalPages: 0,
    itemsPerPage: 12
  });
  const [allTags, setAllTags] = useState<PromptTag[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update URL with current filters
  const updateUrl = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset to page 1 when filters change (except when explicitly changing page)
    if (!updates.hasOwnProperty('page') && Object.keys(updates).length > 0) {
      params.set('page', '1');
    }

    // Update URL
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // Fetch data when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch prompts with current filters
        const result = await fetchPaginatedPrompts({
          page: currentPage,
          search: searchTerm,
          tag: selectedTag || '',
          category: selectedCategory || '',
          sortBy,
        });

        setData(result);

        // Fetch tags if not already loaded
        if (allTags.length === 0) {
          const fetchedTags = await getAllTags();
          setAllTags(fetchedTags);

          // Extract unique categories from the data for the filter dropdown
          if (result.items.length > 0) {
            const uniqueCategories = Array.from(
              new Set(result.items.map(item => item.category).filter(Boolean))
            );
            setCategories(uniqueCategories);
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load prompts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchTerm, selectedTag, selectedCategory, sortBy, allTags.length]);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl({ search: searchTerm });
  };

  // Handle tag click
  const handleTagClick = (tag: string | null) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    updateUrl({ tag: newTag });
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    if (value === "__all__") {
      setSelectedCategory(null);
      updateUrl({ category: null });
    } else {
      setSelectedCategory(value);
      updateUrl({ category: value });
    }
  };

  // Handle sort change
  const handleSortChange = (value: 'latest' | 'popular') => {
    setSortBy(value);
    updateUrl({ sortBy: value });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedTag(null);
    setSelectedCategory(null);
    setSortBy('latest');
    setCurrentPage(1);
    updateUrl({ search: null, tag: null, category: null, sortBy: null, page: null });
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedTag || selectedCategory || sortBy !== 'latest';

  // Server returns already filtered/paginated data; no need for local filtering
  // If further local filtering is required, add here. Otherwise, use data.items directly.

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t('explore.title') || 'Explore Prompts'}</h1>
        <div className="space-y-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder={t('searchPrompts') || 'Search prompts...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>

              {categories.length > 0 && (
                <Select value={selectedCategory ?? "__all__"} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Button type="submit">Search</Button>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedTag === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleTagClick(null)}
            className="rounded-full"
          >
            All
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagClick(tag)}
              className="rounded-full"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {
        loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[180px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )
      }

      {/* Error State */}
      {
        !loading && error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )
      }

      {/* Empty State */}
      {
        !loading && !error && data.items.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'There are no prompts available at the moment.'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters}>Clear Filters</Button>
            )}
          </div>
        )
      }

      {/* Prompts Grid */}
      {
        !loading && !error && data.items.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {data.items.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
                  let pageNumber = i + 1;

                  // Handle pagination for many pages
                  if (data.totalPages > 5) {
                    if (currentPage <= 3) {
                      // First pages
                      if (i === 3) return <span key="ellipsis1">...</span>;
                      if (i === 4) pageNumber = data.totalPages;
                    } else if (currentPage >= data.totalPages - 2) {
                      // Last pages
                      if (i === 1) return <span key="ellipsis2">...</span>;
                      if (i === 0) pageNumber = 1;
                      if (i > 1) pageNumber = data.totalPages - (4 - i);
                    } else {
                      // Middle pages
                      if (i === 0) pageNumber = 1;
                      if (i === 1) return <span key="ellipsis3">...</span>;
                      if (i === 2) pageNumber = currentPage;
                      if (i === 3) pageNumber = currentPage + 1;
                      if (i === 4) return <span key="ellipsis4">...</span>;
                    }
                  }

                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNumber)}
                      className="w-10 h-10 p-0"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === data.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )
      }
    </>
  );
}

// Loading component for Suspense fallback
function ExploreLoading() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">{t('explore.title') || 'Explore Prompts'}</h1>
      <div className="flex justify-center items-center py-20">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-blue-400 dark:bg-blue-600 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div >
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
