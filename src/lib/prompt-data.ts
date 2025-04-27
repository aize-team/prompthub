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
  author: string; // Added author field
  likes: number; // Added likes field
  copies: number; // Added copies field
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

// Function to get all unique tags from the data file
export const getAllTags = async (): Promise<PromptTag[]> => {
  try {
    const allPrompts = await fetchPrompts(); // This will now fetch from the JSON file
    const tagSet = new Set<PromptTag>();
    allPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
    });
    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error getting all tags:', error);
    return []; // Return empty array on failure
  }
};

// Note: The seedPromptsToDatabase and fetchAndSeedPrompts functions might need
// adjustments if the API routes they call are also changed to use the JSON file
// instead of a database. For now, keeping them as is assuming they might interact
// with a potential future database layer or a different seeding mechanism.

// Function to seed prompts to the database (assuming this interacts with a backend service)
export const seedPromptsToDatabase = async (prompts: PromptDetail[]): Promise<void> => {
  try {
    const response = await fetch('/api/prompts/seed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompts }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('Prompts successfully seeded to database');
  } catch (error) {
    console.error('Error seeding prompts to database:', error);
    throw error;
  }
};

// Function to fetch all prompts from the database and seed them back (assuming this interacts with a backend service)
export const fetchAndSeedPrompts = async (): Promise<void> => {
  try {
    // Force fetch from real database (not mock data file in this context)
    const response = await fetch('/api/prompts'); // Assuming /api/prompts now reads from the JSON file or a database
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const prompts: PromptDetail[] = await response.json();
    console.log(`Fetched ${prompts.length} prompts from data source`);

    // Seed them back (this might be redundant if /api/prompts reads from the target source)
    // Keeping this for now, but might need review based on overall data flow.
    await seedPromptsToDatabase(prompts);
    console.log('Successfully completed fetch and seed operation');
  } catch (error) {
    console.error('Error in fetch and seed operation:', error);
    throw error;
  }
};