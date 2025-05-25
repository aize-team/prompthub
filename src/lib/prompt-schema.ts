export interface Prompt {
  id: string;
  title: string;
  content: string;
  description?: string;
  useCases?: string[];
  category?: string;
  tags?: string[] | string;
  author?: string;
  user_id?: string;
  user_details?: {
    email: string | null;
    name: string | null;
    image: string | null;
  };
  isAnonymous?: boolean;
  likes?: number;
  copies?: number;
  createdAt?: any;
  updatedAt?: any;
  searchTerms?: string[];
  model?: string;
  promptType?: string;
  complexityLevel?: string;
  example?: string;
  tips?: string;
  expectedResponse?: string;
}

export type PromptInput = Omit<Prompt, 'id' | 'likes' | 'copies' | 'createdAt' | 'updatedAt'>;

export function validatePrompt(data: any): data is PromptInput {
  return typeof data?.title === 'string' && typeof data?.content === 'string';
}
