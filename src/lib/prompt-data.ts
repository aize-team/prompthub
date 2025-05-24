// Define the types for prompts and their details
export type PromptTag = string;
export type PromptCategory = string;
export type PromptUseCase = string;

export type PromptDetail = {
  id: string;
  title: string;
  content: string;
  useCases: PromptUseCase[];
  category: PromptCategory;
  tags: PromptTag[] | string;
  author: string;
  likes: number;
  copies: number;
  createdAt?: string | FirebaseFirestore.Timestamp;
  updatedAt?: string | FirebaseFirestore.Timestamp;
  searchTerms?: string[];
  // Additional fields for the contribute page
  model?: string;
  promptType?: string;
  complexityLevel?: string;
  example?: string;
  tips?: string;
  expectedResponse?: string;
  isAnonymous?: boolean;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
  itemsPerPage: number;
};

// Function to fetch paginated prompts with filters
export const fetchPaginatedPrompts = async ({
  page = 1,
  search = '',
  tag = '',
  category = '',
  sortBy = 'latest',
}: {
  page?: number;
  search?: string;
  tag?: string;
  category?: string;
  sortBy?: 'latest' | 'popular';
} = {}): Promise<PaginatedResponse<PromptDetail>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(tag && { tag }),
      ...(category && { category }),
      sortBy,
    });

    const response = await fetch(`/api/prompts?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompts. Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching paginated prompts:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      totalPages: 0,
      itemsPerPage: 12,
    };
  }
};

// Function to fetch all prompts (kept for backward compatibility)
export const fetchPrompts = async (): Promise<PromptDetail[]> => {
  try {
    const response = await fetch('/api/prompts');
    if (!response.ok) {
      throw new Error(`Failed to fetch prompts. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return [];
  }
};

// Function to get a prompt by its ID from the data file
export const getPromptById = async (id: string): Promise<PromptDetail | undefined> => {
  try {
    // Try fetching directly from the API route first (if implemented for single fetch)
    try {
      const response = await fetch(`/api/prompt/${id}`);
      if (response.ok) {
        const prompt = await response.json();
        return prompt;
      }
    } catch (directFetchError) {
      console.warn(`Direct API fetch by ID failed, falling back to reading all data: ${directFetchError}`);
    }

    // Fallback: Fetch all prompts and find by ID
    const allPrompts = await fetchPrompts(); // This will now fetch from the JSON file
    return allPrompts.find(prompt => prompt.id === id);
  } catch (error) {
    console.error('Error getting prompt by ID:', error);
    return undefined; // Return undefined on failure
  }
};

// Function to get the top 5 most used tags from the API
export const getAllTags = async (): Promise<PromptTag[]> => {
  try {
    const response = await fetch('/api/tags');
    if (!response.ok) {
      throw new Error(`Failed to fetch tags. Status: ${response.status}`);
    }
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error getting all tags:', error);
    return []; // Return empty array on failure
  }
};