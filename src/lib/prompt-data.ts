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
  tags: PromptTag[];
  // Add other fields like description, author, etc. if needed in the future
};

// Function to fetch all prompts from the API
export const fetchPrompts = async (): Promise<PromptDetail[]> => {
  try {
    const response = await fetch('/api/prompts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const prompts: PromptDetail[] = await response.json();
    return prompts;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return []; // Return an empty array on error
  }
};

// Function to get a prompt by its ID from the API (fetches all and filters)
export const getPromptById = async (id: string): Promise<PromptDetail | undefined> => {
  const allPrompts = await fetchPrompts();
  return allPrompts.find(prompt => prompt.id === id);
};

// Function to get all unique tags from the API (fetches all and extracts tags)
export const getAllTags = async (): Promise<PromptTag[]> => {
  const allPrompts = await fetchPrompts();
  const tagSet = new Set<PromptTag>();
  allPrompts.forEach(prompt => {
    prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
  });
  return Array.from(tagSet).sort();
};