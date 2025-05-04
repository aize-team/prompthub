import { useState, useEffect } from 'react';
import { PromptDetail } from '@/lib/prompt-data';

type AnonymousPromptData = {
  title: string;
  content: string;
  category?: string;
  model?: string;
  tags?: string;
  promptType?: string;
  complexityLevel?: string;
  useCases?: string[];
  example?: string;
  tips?: string;
  expectedResponse?: string;
};

type UseAnonymousPromptProps = {
  data: AnonymousPromptData;
  onStatusChange?: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
};

/**
 * Custom hook for handling anonymous prompt saving
 */
export function useAnonymousPrompt({ data, onStatusChange }: UseAnonymousPromptProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedPrompt, setSavedPrompt] = useState<PromptDetail | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Function to save prompt anonymously
  const savePrompt = async () => {
    if (!data.title || !data.content) {
      return;
    }

    setStatus('saving');
    if (onStatusChange) onStatusChange('saving');

    try {
      const response = await fetch('/api/prompts/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to save prompt: ${response.statusText}`);
      }

      const savedData = await response.json();
      setSavedPrompt(savedData);
      setStatus('saved');
      if (onStatusChange) onStatusChange('saved');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error saving prompt');
      setError(error);
      setStatus('error');
      if (onStatusChange) onStatusChange('error');
      console.error('Error saving anonymous prompt:', error);
    }
  };

  return {
    status,
    savedPrompt,
    error,
    savePrompt,
  };
}
