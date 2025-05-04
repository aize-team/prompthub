import { useEffect, useRef, useState } from 'react';

interface UseAutoSavePromptProps<T> {
  data: T;
  isLoggedIn: boolean;
  selectedPrompt: any;
  onSaved?: () => void;
  allowAnonymous?: boolean; // New prop to allow anonymous saving
}

export function useAutoSavePrompt<T>({ data, isLoggedIn, selectedPrompt, onSaved, onStatusChange, allowAnonymous = false }: UseAutoSavePromptProps<T> & { onStatusChange?: (status: 'idle' | 'saving' | 'saved') => void }) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataRef = useRef<T | null>(null);
  const lastSaveTimeRef = useRef<number>(0);
  const pendingChangesRef = useRef<boolean>(false);
  const saveQueueRef = useRef<T | null>(null);
  
  // Rate limit: maximum 3 requests per minute = 20 seconds between saves
  const RATE_LIMIT_MS = 20000;

  // Function to perform the actual save operation
  const performSave = async (dataToSave: T) => {
    if (onStatusChange) onStatusChange('saving');
    
    let url: string | undefined;
    let method: string | undefined;
    
    if (selectedPrompt) {
      // Update existing prompt
      url = `/api/prompts/${selectedPrompt.id}`;
      method = 'PUT';
    } else if (isLoggedIn) {
      // Create new prompt as logged-in user
      url = '/api/prompts';
      method = 'POST';
    } else if (allowAnonymous) {
      // Create new prompt anonymously
      url = '/api/prompts/anonymous';
      method = 'POST';
    }
    
    // Only proceed if URL and method are defined
    if (url && method) {
      try {
        await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        
        prevDataRef.current = dataToSave;
        lastSaveTimeRef.current = Date.now();
        pendingChangesRef.current = false;
        
        if (onSaved) onSaved();
        if (onStatusChange) onStatusChange('saved');
        
        setTimeout(() => {
          if (onStatusChange && !pendingChangesRef.current) onStatusChange('idle');
        }, 1200);
      } catch (error) {
        console.error('Error saving prompt:', error);
        if (onStatusChange) onStatusChange('idle');
      }
    }
  };

  // Function to schedule the next save based on rate limiting
  const scheduleSave = (dataToSave: T) => {
    const now = Date.now();
    const timeElapsed = now - lastSaveTimeRef.current;
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (timeElapsed >= RATE_LIMIT_MS) {
      // We can save immediately
      performSave(dataToSave);
    } else {
      // We need to wait until the rate limit period is over
      const waitTime = RATE_LIMIT_MS - timeElapsed;
      
      if (onStatusChange) onStatusChange('saving');
      pendingChangesRef.current = true;
      saveQueueRef.current = dataToSave;
      
      timeoutRef.current = setTimeout(() => {
        if (saveQueueRef.current) {
          performSave(saveQueueRef.current);
          saveQueueRef.current = null;
        }
      }, waitTime);
    }
  };

  useEffect(() => {
    // Check if we can save (either logged in or anonymous saving is allowed)
    const canSave = isLoggedIn || allowAnonymous;
    
    if (!canSave) {
      if (onStatusChange) onStatusChange('idle');
      return;
    }
    
    // Check if data has actually changed
    if (JSON.stringify(prevDataRef.current) === JSON.stringify(data)) return;
    
    // Schedule the save operation with rate limiting
    scheduleSave(data);
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isLoggedIn, selectedPrompt, allowAnonymous]);
  
  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
}
