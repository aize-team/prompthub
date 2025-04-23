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

// Centralized array of all prompts
export const allPrompts: PromptDetail[] = [
  {
    id: 'creative-story-starter',
    title: 'Creative Story Starter',
    content: 'Write a story beginning with: The old clockmaker adjusted his spectacles, peering into the intricate mechanism. Suddenly, a faint blue light emanated from within...',
    useCases: ['Creative Writing', 'Storytelling', 'Inspiration'],
    category: 'Writing',
    tags: ['fiction', 'story', 'creative', 'writing prompt', 'fantasy'],
  },
  {
    id: 'python-code-generator',
    title: 'Python Code Generator',
    content: 'Generate a Python function that takes a list of numbers and returns the sum of squares.',
    useCases: ['Coding', 'Development', 'Code Generation'],
    category: 'Programming',
    tags: ['python', 'code', 'programming', 'function', 'utility'],
  },
  {
    id: 'marketing-copy-idea',
    title: 'Marketing Copy Idea',
    content: 'Craft a catchy slogan for a new brand of eco-friendly coffee.',
    useCases: ['Marketing', 'Copywriting', 'Branding'],
    category: 'Business',
    tags: ['marketing', 'slogan', 'copywriting', 'coffee', 'branding', 'advertising'],
  },
  {
    id: 'explain-quantum-computing',
    title: 'Explain Quantum Computing Simply',
    content: "Explain the basic concept of quantum computing like I'm five years old.",
    useCases: ['Education', 'Explanation', 'Simplification'],
    category: 'Science & Technology',
    tags: ['science', 'technology', 'quantum computing', 'ELI5', 'explanation'],
  },
  {
    id: 'generate-recipe',
    title: 'Generate a Simple Recipe',
    content: 'Create a simple recipe for a vegan pasta dish using common pantry ingredients.',
    useCases: ['Cooking', 'Recipe Generation', 'Food'],
    category: 'Lifestyle',
    tags: ['recipe', 'cooking', 'vegan', 'pasta', 'food'],
  },
  // Add more prompts here as your collection grows
];

// Function to get all unique tags
export const getAllTags = (): PromptTag[] => {
  const tagSet = new Set<PromptTag>();
  allPrompts.forEach(prompt => {
    prompt.tags.forEach(tag => tagSet.add(tag.toLowerCase()));
  });
  return Array.from(tagSet).sort();
};

// Function to get a prompt by its ID
export const getPromptById = (id: string): PromptDetail | undefined => {
  return allPrompts.find(prompt => prompt.id === id);
};
