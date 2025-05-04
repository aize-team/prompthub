'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext';
import { useLanguage } from '@/context/LanguageContext';

interface PromptEditorProps {
  promptData: any;
  onChange: (field: string, value: any) => void;
  isLoggedIn: boolean;
}

const PromptEditor: React.FC<PromptEditorProps> = ({
  promptData,
  onChange,
  isLoggedIn,
}) => {
  const { t } = useLanguage();
  const { openModal } = useAuthModal();
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });

  // Update character count when prompt data changes
  useEffect(() => {
    setCharCount({
      title: promptData.title?.length || 0,
      content: promptData.content?.length || 0,
    });
  }, [promptData.title, promptData.content]);

  const handleChange = (field: string, value: any) => {
    if (!isLoggedIn) {
      openModal();
      return;
    }
    onChange(field, value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('contribute.prompt-title')}
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {charCount.title}/100
            </span>
          </div>
          <input
            id="title"
            type="text"
            value={promptData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder={t('contribute.prompt-title-placeholder')}
            maxLength={100}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
            readOnly={!isLoggedIn}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('contribute.prompt-content')}
            </label>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {charCount.content}/2000
            </span>
          </div>
          <textarea
            id="content"
            value={promptData.content || ''}
            onChange={(e) => handleChange('content', e.target.value)}
            placeholder={t('contribute.prompt-content-placeholder')}
            maxLength={2000}
            rows={12}
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all resize-none font-mono"
            readOnly={!isLoggedIn}
          />
        </div>

        {!isLoggedIn && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-sm text-blue-800 dark:text-blue-300">
            <p className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('contribute.need-signin-edit')}
              <button onClick={openModal} className="text-blue-600 dark:text-blue-400 font-medium hover:underline">{t('header.signin')}</button> {t('contribute.to-edit-prompt')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptEditor;
