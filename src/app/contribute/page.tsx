'use client';

import React, { useState } from 'react';
import { useAutoSavePrompt } from '@/hooks/useAutoSavePrompt';
import { useSession } from 'next-auth/react';
import ContributeLayout from '@/components/contribute/ContributeLayout';
import PromptHistorySidebar from '@/components/contribute/PromptHistorySidebar';
import PromptEditor from '@/components/contribute/PromptEditor';
import PromptSettingsSidebar from '@/components/contribute/PromptSettingsSidebar';
import ContributeActions from '@/components/contribute/ContributeActions';
import AutoSaveStatus from '@/components/contribute/AutoSaveStatus';

export default function ContributePage() {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const [promptData, setPromptData] = useState({
    title: '',
    content: '',
    category: '',
    model: '',
    tags: '',
    promptType: '',
    complexityLevel: '',
    useCases: [] as string[],
    example: '',
    tips: '',
    expectedResponse: '',
  });

  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  const isValid = Boolean(promptData.title && promptData.content);
const isRecommendedFilled = Boolean(
  promptData.category &&
  promptData.model &&
  promptData.promptType &&
  promptData.complexityLevel &&
  promptData.tags &&
  promptData.example &&
  promptData.tips
);

  useAutoSavePrompt({
    data: promptData,
    isLoggedIn: isLoggedIn && isValid,
    selectedPrompt,
    onStatusChange: setAutoSaveStatus,
  });

  const handleSelectPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);
    setPromptData({
      title: prompt.title || '',
      content: prompt.content || '',
      category: prompt.category || '',
      model: prompt.model || '',
      tags: Array.isArray(prompt.tags) ? prompt.tags.join(', ') : prompt.tags || '',
      promptType: prompt.promptType || '',
      complexityLevel: prompt.complexityLevel || '',
      useCases: prompt.useCases || [],
      example: prompt.example || '',
      tips: prompt.tips || '',
      expectedResponse: prompt.expectedResponse || '',
    });
  };

  const handleChange = (field: string, value: any) => {
    setPromptData(prev => ({ ...prev, [field]: value }));
  };

  const handleClear = () => {
    setSelectedPrompt(null);
    setPromptData({
      title: '',
      content: '',
      category: '',
      model: '',
      tags: '',
      promptType: '',
      complexityLevel: '',
      useCases: [],
      example: '',
      tips: '',
      expectedResponse: '',
    });
  };

  const handleSave = async () => {
    setSubmitting(true);
    const url = '/api/prompts' + (selectedPrompt ? `/${selectedPrompt.id}` : '/create');
    const res = await fetch(url, {
      method: selectedPrompt ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData),
    });
    // TODO: handle success/error
    if (res.ok) handleClear();
    setSubmitting(false);
  };

  return (
    <ContributeLayout
      leftSidebar={<PromptHistorySidebar onSelectPrompt={handleSelectPrompt} />}
      rightSidebar={<PromptSettingsSidebar settings={promptData} onChange={handleChange} isLoggedIn={isLoggedIn} />}
    >
      <PromptEditor promptData={promptData} onChange={handleChange} isLoggedIn={isLoggedIn} />
      <AutoSaveStatus status={autoSaveStatus} />
      {isValid && !isRecommendedFilled && (
        <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400 px-2">Some recommended fields are empty. Please fill all fields for best results.</div>
      )}
      <ContributeActions
        onSave={handleSave}
        onClear={handleClear}
        isSubmitting={submitting}
        isValid={isValid}
      />
    </ContributeLayout>
  );
}
