'use client';

import React from 'react';
import { useAuthModal } from '@/context/AuthModalContext';
import { useLanguage } from '@/context/LanguageContext';

interface PromptSettings {
  category?: string;
  model?: string;
  tags?: string;
  promptType?: string;
  complexityLevel?: string;
  useCases?: string[];
  example?: string;
  tips?: string;
  expectedResponse?: string;
  contextLength?: string;
  [key: string]: any;
}

interface PromptSettingsSidebarProps {
  // Original API
  settings?: PromptSettings;
  onChange?: (field: string, value: any) => void;
  isLoggedIn?: boolean;
  
  // New API for individual props
  category?: string;
  model?: string;
  tags?: string | string[];
  promptType?: string;
  complexityLevel?: string;
  useCases?: string[];
  example?: string;
  tips?: string;
  expectedResponse?: string;
  onCategoryChange?: (value: string) => void;
  onModelChange?: (value: string) => void;
  onTagsChange?: (value: string) => void;
  onPromptTypeChange?: (value: string) => void;
  onComplexityLevelChange?: (value: string) => void;
  onUseCasesChange?: (value: string[]) => void;
  onExampleChange?: (value: string) => void;
  onTipsChange?: (value: string) => void;
  onExpectedResponseChange?: (value: string) => void;
}

const availableCategories = [
  "General",
  "Writing",
  "Coding",
  "Education",
  "Other",
];

const availableModels = [
  "Any",
  "GPT-4",
  "GPT-3.5",
  "Claude",
  "Gemini",
  "Other",
];

const availablePromptTypes = [
  "Question",
  "Instruction",
  "Conversation",
  "Role-playing",
  "Other",
];

const availableComplexityLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];

const availableUseCases = [
  "Content Creation",
  "Data Analysis",
  "Problem Solving",
  "Creative Writing",
  "Coding",
  "Learning",
  "Business",
  "Personal",
];

const SettingsSection: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const PromptSettingsSidebar: React.FC<PromptSettingsSidebarProps> = ({
  // Original API
  settings = {},
  onChange,
  isLoggedIn = true,
  
  // New API for individual props
  category,
  model,
  tags: tagsProp,
  promptType,
  complexityLevel,
  useCases: useCasesProp,
  example,
  tips,
  expectedResponse,
  onCategoryChange,
  onModelChange,
  onTagsChange,
  onPromptTypeChange,
  onComplexityLevelChange,
  onUseCasesChange,
  onExampleChange,
  onTipsChange,
  onExpectedResponseChange,
  ...props
}) => {
  // Handle both APIs
  const usingIndividualProps = category !== undefined || model !== undefined;
  
  // Get values from the appropriate source
  const getValue = (field: string, defaultValue: any = '') => {
    if (usingIndividualProps) {
      // @ts-ignore
      return props[field] !== undefined ? props[field] : defaultValue;
    }
    return settings[field] !== undefined ? settings[field] : defaultValue;
  };
  
  // Handle changes with the appropriate callback
  const handleChange = (field: string, value: any) => {
    if (!isLoggedIn) {
      openModal();
      return;
    }
    
    if (usingIndividualProps) {
      const callbackName = `on${field.charAt(0).toUpperCase() + field.slice(1)}Change` as keyof typeof props;
      const callback = props[callbackName] as ((value: any) => void) | undefined;
      if (typeof callback === 'function') {
        callback(value);
      }
    } else if (onChange) {
      onChange(field, value);
    }
  };
  
  // Get current values
  const currentCategory = usingIndividualProps ? (category || '') : getValue('category');
  const currentModel = usingIndividualProps ? (model || '') : getValue('model');
  const currentTags = usingIndividualProps ? (Array.isArray(tagsProp) ? tagsProp.join(', ') : tagsProp || '') : getValue('tags');
  const currentPromptType = usingIndividualProps ? (promptType || '') : getValue('promptType');
  const currentComplexityLevel = usingIndividualProps ? (complexityLevel || '') : getValue('complexityLevel');
  const currentUseCases = usingIndividualProps ? (useCasesProp || []) : (Array.isArray(getValue('useCases')) ? getValue('useCases') : []);
  const currentExample = usingIndividualProps ? (example || '') : getValue('example');
  const currentTips = usingIndividualProps ? (tips || '') : getValue('tips');
  const currentExpectedResponse = usingIndividualProps ? (expectedResponse || '') : getValue('expectedResponse');
  
  const { openModal } = useAuthModal();
  const { t } = useLanguage();

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h2 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{t('contribute.prompt-settings')}</h2>
      
      <SettingsSection title={t('contribute.category')}>
        <select
          value={currentCategory}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={!isLoggedIn}
        >
          <option value="">{t('contribute.select-category')}</option>
          {availableCategories.map((category) => (
            <option key={category} value={category}>
              {t(`contribute.category-${category.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </SettingsSection>

      <SettingsSection title={t('contribute.model')}>
        <select
          value={currentModel}
          onChange={(e) => handleChange('model', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={!isLoggedIn}
        >
          <option value="">{t('contribute.select-model')}</option>
          {availableModels.map((model) => (
            <option key={model} value={model}>
              {t(`contribute.model-${model.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </SettingsSection>

      <SettingsSection title={t('contribute.tags')}>
        <input
          type="text"
          value={currentTags}
          onChange={(e) => handleChange('tags', e.target.value.split(',').map(tag => tag.trim()))}
          placeholder={t('contribute.tags-placeholder')}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          readOnly={!isLoggedIn}
        />
      </SettingsSection>

      <SettingsSection title={t('contribute.use-cases')}>
        <input
          type="text"
          value={currentUseCases.join(', ')}
          onChange={(e) => handleChange('useCases', e.target.value.split(',').map(uc => uc.trim()))}
          placeholder={t('contribute.use-cases-placeholder')}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          readOnly={!isLoggedIn}
        />
      </SettingsSection>

      <SettingsSection title={t('contribute.prompt-type')}>
        <select
          value={currentPromptType}
          onChange={(e) => handleChange('promptType', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={!isLoggedIn}
        >
          <option value="">{t('contribute.select-type')}</option>
          {availablePromptTypes.map((type) => (
            <option key={type} value={type}>
              {t(`contribute.prompt-type-${type.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </SettingsSection>

      <SettingsSection title={t('contribute.complexity-level')}>
        <select
          value={currentComplexityLevel}
          onChange={(e) => handleChange('complexityLevel', e.target.value)}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          disabled={!isLoggedIn}
        >
          <option value="">{t('contribute.select-level')}</option>
          {availableComplexityLevels.map((level) => (
            <option key={level} value={level}>
              {t(`contribute.level-${level.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </SettingsSection>

      <SettingsSection title={t('contribute.example-usage')}>
        <textarea
          value={currentExample}
          onChange={(e) => handleChange('example', e.target.value)}
          placeholder={t('contribute.example-placeholder')}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          readOnly={!isLoggedIn}
        />
      </SettingsSection>

      <SettingsSection title={t('contribute.expected-response')}>
        <textarea
          value={currentExpectedResponse}
          onChange={(e) => handleChange('expectedResponse', e.target.value)}
          placeholder={t('contribute.expected-response-placeholder')}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          readOnly={!isLoggedIn}
        />
      </SettingsSection>

      <SettingsSection title={t('contribute.tips')}>
        <textarea
          value={currentTips}
          onChange={(e) => handleChange('tips', e.target.value)}
          placeholder={t('contribute.tips-placeholder')}
          rows={3}
          className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
          readOnly={!isLoggedIn}
        />
      </SettingsSection>

      {!isLoggedIn && (
        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-blue-800 dark:text-blue-300">
          <p className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('contribute.need-signin-settings')}
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptSettingsSidebar;
