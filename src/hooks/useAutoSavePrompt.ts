import { useEffect, useRef } from 'react';

interface UseAutoSavePromptProps<T> {
  data: T;
  isLoggedIn: boolean;
  selectedPrompt: any;
  onSaved?: () => void;
}

export function useAutoSavePrompt<T>({ data, isLoggedIn, selectedPrompt, onSaved, onStatusChange }: UseAutoSavePromptProps<T> & { onStatusChange?: (status: 'idle' | 'saving' | 'saved') => void }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataRef = useRef<T | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      if (onStatusChange) onStatusChange('idle');
      return;
    }
    if (!isLoggedIn) return;
    if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (onStatusChange) onStatusChange('saving');
    timeoutRef.current = setTimeout(async () => {
      const url = '/api/prompts' + (selectedPrompt ? `/${selectedPrompt.id}` : '/create');
      await fetch(url, {
        method: selectedPrompt ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      prevDataRef.current = data;
      if (onSaved) onSaved();
      if (onStatusChange) onStatusChange('saved');
      setTimeout(() => {
        if (onStatusChange) onStatusChange('idle');
      }, 1200);
    }, 1200); // debounce 1.2s

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoggedIn, selectedPrompt]);
}
