import { useState } from 'react';

interface PromptData {
  title: string;
  content: string;
  category?: string;
  model?: string;
  tags?: string | string[];
  promptType?: string;
  complexityLevel?: string;
  useCases?: string[];
  example?: string;
  tips?: string;
  expectedResponse?: string;
}

interface UsePromptEditorProps {
  promptData: PromptData;
  promptId?: string;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
}

export function usePromptEditor({
  promptData,
  promptId,
  onSaveStart,
  onSaveSuccess,
  onSaveError
}: UsePromptEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    if (onSaveStart) onSaveStart();

    try {
      const url = promptId ? `/api/prompts/${promptId}` : '/api/prompts';
      const method = promptId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save prompt: ${response.status}`);
      }

      const data = await response.json();
      
      if (onSaveSuccess) onSaveSuccess();
      return data;
    } catch (error) {
      console.error('Error saving prompt:', error);
      if (onSaveError) onSaveError(error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSave,
    isSaving
  };
}
