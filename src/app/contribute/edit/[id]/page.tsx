'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { usePromptEditor } from '@/hooks/usePromptEditor';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import ContributeLayout from '@/components/contribute/ContributeLayout';
import PromptHistorySidebar from '@/components/contribute/PromptHistorySidebar';
import PromptEditor from '@/components/contribute/PromptEditor';
import PromptSettingsSidebar from '@/components/contribute/PromptSettingsSidebar';
import ContributeActions from '@/components/contribute/ContributeActions';
import AutoSaveStatus from '@/components/contribute/AutoSaveStatus';
import Notification from '@/components/ui/Notification';
import { getPromptById } from '@/lib/prompt-data';
import { Skeleton } from '@/components/ui/skeleton';
import PromptActions from '@/components/contribute/PromptActions';
import ShareButton from '@/components/ui/ShareButton';

function EditPromptContent() {
  const params = useParams<{ id: string }>();
  const promptId = params?.id;
  
  if (!promptId) {
    return <div>Error: No prompt ID provided</div>;
  }
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveTimer, setSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>({ show: false, type: 'info', message: '' });
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const router = useRouter();
  const { t } = useLanguage();
  if (!promptId) {
    return <div>Error: No prompt ID provided</div>;
  }

  const [isLoading, setIsLoading] = useState(true);
  const [promptData, setPromptData] = useState<{
    id: string;
    title: string;
    content: string;
    category: string;
    model?: string;
    tags: string | string[];
    promptType?: string;
    complexityLevel?: string;
    useCases: string[];
    example?: string;
    tips?: string;
    expectedResponse?: string;
  }>({
    id: promptId || '',
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

  // Load prompt data when component mounts or promptId changes
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const data = await getPromptById(promptId);
        if (data) {
          setPromptData({
            ...data,
            // Ensure all required fields have values
            useCases: data.useCases || [],
            category: data.category || '',
            model: data.model || '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags || '',
            promptType: data.promptType || '',
            complexityLevel: data.complexityLevel || '',
            example: data.example || '',
            tips: data.tips || '',
            expectedResponse: data.expectedResponse || '',

          });
        }
      } catch (error) {
        console.error('Error loading prompt:', error);
        setNotification({
          show: true,
          type: 'error',
          message: t('errors.failed-to-load-prompt'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (promptId) {
      loadPrompt();
    } else {
      setIsLoading(false);
    }
  }, [promptId, t]);

  // Save functionality
  const { handleSave, isSaving } = usePromptEditor({
    promptData,
    promptId,
    onSaveStart: () => setAutoSaveStatus('saving'),
    onSaveSuccess: () => {
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);
    },
    onSaveError: (error) => {
      console.error('Save error:', error);
      setAutoSaveStatus('idle');
      showNotification('error', t('contribute.save-fail'));
    },
  });

  // Auto-save with debounce
  useEffect(() => {
    console.log('useEffect triggered', { hasUnsavedChanges });
    if (hasUnsavedChanges) {
      console.log('Has unsaved changes, setting up save timer');
      if (saveTimer) {
        console.log('Clearing existing timer');
        clearTimeout(saveTimer);
      }

      const timer = setTimeout(() => {
        console.log('Save timer fired, calling handleAutoSave');
        handleAutoSave();
      }, 2000); // 2 second debounce

      setSaveTimer(timer);

      return () => {
        console.log('Cleanup: clearing timer');
        if (saveTimer) clearTimeout(saveTimer);
      };
    } else {
      console.log('No unsaved changes, not setting up timer');
    }
  }, [promptData, hasUnsavedChanges]);

  // Handle form field changes
  const handleChange = (field: string, value: string | string[]) => {
    console.log('Field changed:', field, value);
    setPromptData(prev => ({
      ...prev,
      [field]: value
    }));
    console.log('Setting hasUnsavedChanges to true');
    setHasUnsavedChanges(true);
  };

  // Auto-save function
  const handleAutoSave = useCallback(async () => {
    console.log('handleAutoSave called', { hasUnsavedChanges, isSaving });
    if (!hasUnsavedChanges || isSaving) {
      console.log('Skipping auto-save - no unsaved changes or already saving');
      return;
    }

    try {
      console.log('Starting auto-save...');
      setAutoSaveStatus('saving');
      console.log('autoSaveStatus set to "saving"');

      await handleSave();

      console.log('Auto-save successful');
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      console.log('autoSaveStatus set to "saved"');

      // Reset saved status after 2 seconds
      setTimeout(() => {
        console.log('Resetting autoSaveStatus to "idle"');
        setAutoSaveStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Auto-save failed:', error);
      setAutoSaveStatus('idle');
      console.log('autoSaveStatus set to "idle" due to error');
    }
  }, [hasUnsavedChanges, isSaving, handleSave]);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      await handleSave();
      showNotification('success', t('contribute.save-success'));
    } catch (error) {
      console.error('Error saving prompt:', error);
      showNotification('error', t('contribute.save-fail'));
    }
  };

  // Handle form reset
  const handleReset = () => {
    setPromptData({
      id: promptId || '',
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
    showNotification('info', t('contribute.cleared'));
  };

  // Show notification
  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setNotification({
      show: true,
      type,
      message
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Validate form before submission
  const isFormValid = () => {
    return !!promptData.title && !!promptData.content;
  };

  // Create the left sidebar content
  const leftSidebar = (
    <PromptHistorySidebar
      onSelectPrompt={(prompt) => {
        router.push(`/contribute/edit/${prompt.id}`);
      }}
    />
  );

  // Create the right sidebar content
  const rightSidebar = !isLoading ? (
    <PromptSettingsSidebar
      isLoggedIn={isLoggedIn}
      category={promptData?.category || ''}
      model={promptData?.model || ''}
      tags={promptData?.tags || ''}
      promptType={promptData?.promptType || ''}
      complexityLevel={promptData?.complexityLevel || ''}
      useCases={promptData?.useCases || []}
      example={promptData?.example || ''}
      tips={promptData?.tips || ''}
      expectedResponse={promptData?.expectedResponse || ''}
      onChange={handleChange}
    />
  ) : null;

  // Main content
  const mainContent = (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header with title and actions */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {promptData?.title || 'Edit Prompt'}
          </h1>
          <div className="flex items-center gap-3">
            <ShareButton 
              title={promptData?.title || 'Edit Prompt'}
              promptId={promptData?.id}
              promptContent={promptData?.content}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      </div>
      
      {/* Editor area */}
      <div className="flex-1 overflow-auto">
        <div className="h-full max-w-4xl mx-auto p-4">
          <PromptEditor
            title={promptData?.title || ''}
            content={promptData?.content || ''}
            onTitleChange={(value) => handleChange('title', value)}
            onContentChange={(value) => handleChange('content', value)}
          />
        </div>
      </div>

      {/* Footer - fixed height */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <AutoSaveStatus
              status={autoSaveStatus}
              lastSaved={lastSaved}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>
          <ContributeActions
            onSave={handleSubmit}
            onClear={handleReset}
            isSubmitting={isSaving}
            isValid={isFormValid()}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ContributeLayout
        leftSidebar={leftSidebar}
        rightSidebar={rightSidebar}
      >
        {mainContent}
      </ContributeLayout>

      {/* Notification */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Notification
            show={notification.show}
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
          />
        </div>
      )}
    </>
  );
}

// Main export function
export default function EditPromptPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <Skeleton className="h-12 w-1/3 mb-6" />
        <div className="flex gap-6">
          <div className="w-1/4">
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="flex-1">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    }>
      <EditPromptContent />
    </Suspense>
  );
}
