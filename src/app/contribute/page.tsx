'use client';

import React, { useState, useEffect } from 'react';
import { useAutoSavePrompt } from '@/hooks/useAutoSavePrompt';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import ContributeLayout from '@/components/contribute/ContributeLayout';
import PromptHistorySidebar from '@/components/contribute/PromptHistorySidebar';
import PromptEditor from '@/components/contribute/PromptEditor';
import PromptSettingsSidebar from '@/components/contribute/PromptSettingsSidebar';
import ContributeActions from '@/components/contribute/ContributeActions';
import AutoSaveStatus from '@/components/contribute/AutoSaveStatus';
import Notification from '@/components/ui/Notification';
import { getPromptById } from '@/lib/prompt-data';

export default function ContributePage() {
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>({ show: false, type: 'info', message: '' });
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const searchParams = useSearchParams();

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
  
  // Load prompt details from URL query parameters or localStorage
  useEffect(() => {
    // First check if there's data in localStorage (from main page)
    const cachedPromptForm = localStorage.getItem('cachedPromptForm');
    const cachedPromptStep = localStorage.getItem('cachedPromptStep');
    
    if (cachedPromptForm && cachedPromptStep === '2') {
      try {
        const formData = JSON.parse(cachedPromptForm);
        setPromptData({
          title: formData.title || '',
          content: formData.content || '',
          category: formData.category || '',
          model: formData.model || '',
          tags: formData.tags || '',
          promptType: formData.promptType || '',
          complexityLevel: formData.complexityLevel || '',
          useCases: Array.isArray(formData.useCases) ? formData.useCases : [],
          example: formData.example || '',
          tips: formData.tips || '',
          expectedResponse: formData.expectedResponse || '',
        });
        
        // Clear localStorage after using it
        localStorage.removeItem('cachedPromptForm');
        localStorage.removeItem('cachedPromptStep');
        
        console.log('Loaded prompt data from localStorage');
        return; // Exit early since we've loaded data from localStorage
      } catch (error) {
        console.error('Error parsing cached prompt form:', error);
      }
    }
    
    // If no localStorage data, check URL query parameters (from prompt detail page)
    const promptId = searchParams.get('id');
    if (promptId) {
      const fetchPromptDetails = async () => {
        try {
          const prompt = await getPromptById(promptId);
          if (prompt) {
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
            console.log('Loaded prompt data from API using ID:', promptId);
          }
        } catch (error) {
          console.error('Error fetching prompt details:', error);
        }
      };
      fetchPromptDetails();
    }
  }, [searchParams]);

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

  // Show notification for anonymous users when they have valid data
  useEffect(() => {
    if (!isLoggedIn && isValid && !notification.show) {
      setNotification({
        show: true,
        type: 'info',
        message: 'Your prompt will be saved anonymously. Sign in to save it to your account.'
      });
    }
  }, [isLoggedIn, isValid, notification.show]);
  
  useAutoSavePrompt({
    data: promptData,
    isLoggedIn: isLoggedIn && isValid,
    selectedPrompt,
    onStatusChange: setAutoSaveStatus,
    allowAnonymous: !isLoggedIn && isValid, // Allow anonymous saving when user is not logged in but has valid data
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
    
    try {
      let url;
      let method;
      let isAnonymous = false;
      
      if (selectedPrompt) {
        // Update existing prompt
        url = `/api/prompts/${selectedPrompt.id}`;
        method = 'PUT';
      } else if (isLoggedIn) {
        // Create new prompt as logged-in user
        url = '/api/prompts';
        method = 'POST';
      } else {
        // Create new prompt anonymously
        url = '/api/prompts/anonymous';
        method = 'POST';
        isAnonymous = true;
      }
      
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptData),
      });
      
      if (res.ok) {
        // Show success message based on whether it was saved anonymously or not
        if (isAnonymous) {
          setNotification({
            show: true,
            type: 'success',
            message: 'Your prompt was saved anonymously! Sign in to save it to your account.'
          });
        } else {
          setNotification({
            show: true,
            type: 'success',
            message: 'Your prompt was saved successfully!'
          });
        }
        handleClear();
      } else {
        // Handle error
        const errorText = await res.text();
        console.error('Failed to save prompt:', errorText);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to save prompt. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error saving prompt:', error);
      setNotification({
        show: true,
        type: 'error',
        message: 'An error occurred while saving your prompt.'
      });
    } finally {
      setSubmitting(false);
    }
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
      
      {/* Notification for anonymous saving and other messages */}
      <Notification
        show={notification.show}
        type={notification.type}
        message={notification.message}
        onClose={() => setNotification({ ...notification, show: false })}
      />
    </ContributeLayout>
  );
}
