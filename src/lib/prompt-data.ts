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

// Mock data for development to avoid Firebase permission issues
const mockPrompts: PromptDetail[] = [
  {
    id: '1',
    title: 'Creative Writing Assistant',
    content: 'You are an expert creative writing assistant. Help me craft a compelling short story about [THEME] that incorporates elements of [GENRE] and features a character who [CHARACTER TRAIT]. The story should be approximately [LENGTH] and suitable for [AUDIENCE].',
    useCases: ['writing', 'creative', 'storytelling'],
    category: 'Creative',
    tags: ['writing', 'creative', 'storytelling', 'fiction'],
  },
  {
    id: '2',
    title: 'Code Reviewer',
    content: 'Act as an experienced software engineer. Review my code and provide feedback on best practices, potential bugs, performance issues, and maintainability concerns. Focus on [LANGUAGE/FRAMEWORK] conventions.',
    useCases: ['programming', 'code review', 'software engineering'],
    category: 'Development',
    tags: ['coding', 'programming', 'review', 'software'],
  },
  {
    id: '3',
    title: 'Business Proposal Generator',
    content: 'Help me create a professional business proposal for [PRODUCT/SERVICE] targeting [AUDIENCE]. Include sections for executive summary, problem statement, proposed solution, market analysis, competitive advantage, pricing strategy, and implementation timeline.',
    useCases: ['business', 'proposal', 'marketing'],
    category: 'Business',
    tags: ['business', 'proposal', 'marketing', 'sales'],
  },
  {
    id: '4',
    title: 'Recipe Creator',
    content: 'Create a detailed recipe for a [DISH TYPE] that uses [INGREDIENT LIST]. Include preparation time, cooking time, difficulty level, ingredients, detailed step-by-step instructions, nutritional information, and serving suggestions.',
    useCases: ['cooking', 'recipes', 'meal planning'],
    category: 'Food',
    tags: ['cooking', 'recipe', 'food', 'culinary'],
  },
  {
    id: '5',
    title: 'Data Analysis Assistant',
    content: 'Act as a data analysis expert. Help me analyze the following [DATASET/DESCRIPTION] to identify patterns, trends, and insights. Suggest appropriate statistical methods and visualizations. Also recommend potential actions based on the findings.',
    useCases: ['data analysis', 'statistics', 'research'],
    category: 'Analytics',
    tags: ['data', 'analysis', 'statistics', 'research'],
  },
  {
    id: '6',
    title: 'Language Tutor',
    content: 'You are an experienced [LANGUAGE] tutor. Create a structured lesson about [TOPIC/GRAMMAR POINT] at a [LEVEL] level. Include explanations, examples, common mistakes to avoid, and practice exercises with answers.',
    useCases: ['language learning', 'education', 'tutoring'],
    category: 'Education',
    tags: ['language', 'learning', 'education', 'tutor'],
  },
  {
    id: '7',
    title: 'Travel Itinerary Planner',
    content: 'Create a detailed [NUMBER] day travel itinerary for [DESTINATION] for a [TYPE OF TRAVELER]. Include recommendations for accommodations, transportation, activities, attractions, restaurants, and estimated costs. Consider the [SEASON/MONTH] of travel and [SPECIAL REQUIREMENTS] in your planning.',
    useCases: ['travel', 'planning', 'itinerary'],
    category: 'Travel',
    tags: ['travel', 'vacation', 'planning', 'itinerary'],
  },
  {
    id: '8',
    title: 'Personal Fitness Coach',
    content: 'Act as a professional fitness coach. Design a [DURATION] workout program for [GOAL] targeting [SPECIFIC BODY PARTS/FITNESS ELEMENTS]. The workout should be suitable for [FITNESS LEVEL] with [EQUIPMENT AVAILABLE]. Include exercise descriptions, sets, reps, rest periods, and progression plan.',
    useCases: ['fitness', 'health', 'exercise'],
    category: 'Health',
    tags: ['fitness', 'workout', 'health', 'exercise'],
  }
];

// Function to fetch all prompts from the API
export const fetchPrompts = async (): Promise<PromptDetail[]> => {
  try {
    // Always fetch from the database instead of using mock data
    const response = await fetch('/api/prompts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const prompts: PromptDetail[] = await response.json();

    // Only return mock data if API call fails or returns empty result
    if (!prompts || prompts.length === 0) {
      console.warn('API returned empty result, using mock data as fallback');
      return mockPrompts;
    }

    return prompts;
  } catch (error) {
    console.error('Error fetching prompts:', error);
    // Return mock data as fallback when API fails
    return mockPrompts;
  }
};

// Function to get a prompt by its ID from the API (fetches all and filters)
export const getPromptById = async (id: string): Promise<PromptDetail | undefined> => {
  try {
    // Always fetch from the database instead of using mock data
    try {
      // First try to fetch directly from the prompt ID endpoint
      const response = await fetch(`/api/prompt/${id}`);
      if (response.ok) {
        const prompt = await response.json();
        return prompt;
      }
    } catch (directFetchError) {
      console.warn(`Direct fetch by ID failed, trying alternate method: ${directFetchError}`);
    }

    // If direct fetch fails, fall back to fetching all and filtering
    const allPrompts = await fetchPrompts();
    return allPrompts.find(prompt => prompt.id === id);
  } catch (error) {
    console.error('Error getting prompt by ID:', error);
    // Fallback to mock data
    return mockPrompts.find(prompt => prompt.id === id);
  }
};

// Function to get all unique tags from the API (fetches all and extracts tags)
export const getAllTags = async (): Promise<PromptTag[]> => {
  try {
    // Always fetch from the database instead of using mock data
    const allPrompts = await fetchPrompts();
    const tagSet = new Set<PromptTag>();
    allPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
    });
    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error getting all tags:', error);
    // Fallback to mock data tags
    const tagSet = new Set<PromptTag>();
    mockPrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
    });
    return Array.from(tagSet).sort();
  }
};

// Function to seed prompts to the database
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

// Function to fetch all prompts from the database and seed them back
export const fetchAndSeedPrompts = async (): Promise<void> => {
  try {
    // Force fetch from real database (not mock data)
    const response = await fetch('/api/prompts');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const prompts: PromptDetail[] = await response.json();
    console.log(`Fetched ${prompts.length} prompts from database`);

    // Seed them back to the database
    await seedPromptsToDatabase(prompts);
    console.log('Successfully completed fetch and seed operation');
  } catch (error) {
    console.error('Error in fetch and seed operation:', error);
    throw error;
  }
};