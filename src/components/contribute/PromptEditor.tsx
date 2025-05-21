'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext';
import { useLanguage } from '@/context/LanguageContext';

interface PromptEditorProps {
  // Original API
  promptData?: any;
  onChange?: (field: string, value: any) => void;
  isLoggedIn?: boolean;
  
  // New API for individual props
  title?: string;
  content?: string;
  onTitleChange?: (value: string) => void;
  onContentChange?: (value: string) => void;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  promptData,
  onChange,
  isLoggedIn,
  title,
  content,
  onTitleChange,
  onContentChange
}) => {
  const { t } = useLanguage();
  const { openModal } = useAuthModal();
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });

  // Determine which API we're using
  const usingIndividualProps = title !== undefined || content !== undefined;
  
  // Get the actual title and content values
  const titleValue = usingIndividualProps ? title || '' : promptData?.title || '';
  const contentValue = usingIndividualProps ? content || '' : promptData?.content || '';
  
  // Determine if user is logged in (default to true if not specified)
  const userIsLoggedIn = isLoggedIn !== undefined ? isLoggedIn : true;

  // Update character count when data changes
  useEffect(() => {
    setCharCount({
      title: titleValue.length,
      content: contentValue.length,
    });
  }, [titleValue, contentValue]);

  const handleChange = (field: string, value: any) => {
    if (!userIsLoggedIn) {
      openModal();
      return;
    }
    
    if (usingIndividualProps) {
      if (field === 'title' && onTitleChange) {
        onTitleChange(value);
      } else if (field === 'content' && onContentChange) {
        onContentChange(value);
      }
    } else if (onChange) {
      onChange(field, value);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange('title', e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (usingIndividualProps && onContentChange) {
      onContentChange(e.target.value);
    } else if (onChange) {
      onChange('content', e.target.value);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="prompt-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contribute.prompt-title')}
          </label>
          <span className="text-xs text-gray-500">
            {charCount.title}/100
          </span>
        </div>
        <input
          type="text"
          id="prompt-title"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          placeholder={t('contribute.prompt-title-placeholder')}
          value={titleValue}
          onChange={handleTitleChange}
          maxLength={100}
          readOnly={!userIsLoggedIn}
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="prompt-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('contribute.prompt-content')}
          </label>
          <span className="text-xs text-gray-500">
            {charCount.content}/2000
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <textarea
            id="prompt-content"
            className="w-full h-full p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white resize-none"
            placeholder={t('contribute.prompt-content-placeholder')}
            value={contentValue}
            onChange={handleContentChange}
            maxLength={2000}
            readOnly={!userIsLoggedIn}
          />
        </div>
      </div>
      {!userIsLoggedIn && (
        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('contribute.need-signin-edit')}
            <button 
              onClick={openModal} 
              className="ml-1 text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              {t('header.signin')}
            </button>
            {t('contribute.to-edit-prompt')}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptEditor;
