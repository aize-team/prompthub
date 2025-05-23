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
  // Additional fields for the contribute page
  model?: string;
  promptType?: string;
  complexityLevel?: string;
  example?: string;
  tips?: string;
  expectedResponse?: string;
  isAnonymous?: boolean;
};

// Function to fetch all prompts from the data file
export const fetchPrompts = async (): Promise<PromptDetail[]> => {
  try {
    const response = await fetch('/data/prompts.json'); // Fetch from JSON file
    if (!response.ok) {
      // If fetching from the data file fails, fallback to API (if available)
      // This part assumes you might still have the /api/prompts route for seeding/other purposes
      // If not, you might want to handle this error differently or remove the API fallback
      try {
        const apiResponse = await fetch('/api/prompts');
        if (!apiResponse.ok) {
          throw new Error(`Failed to fetch prompts from data file and API. Status: ${response.status || apiResponse.status}`);
        }
        return await apiResponse.json();
      } catch (apiError) {
        console.error('Error fetching prompts from API fallback:', apiError);
        throw new Error(`Failed to fetch prompts. Original status: ${response.status}. API fallback failed.`);
      }
    }
    const prompts: PromptDetail[] = await response.json();
    return prompts;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    // In a real app, you might want a more robust error handling or a true database fallback
    return []; // Return empty array on failure
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