'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useAuthModal } from '@/context/AuthModalContext';

interface ContributeActionsProps {
  onSave: () => void;
  onClear: () => void;
  isSubmitting: boolean;
  isValid: boolean;
}

const ContributeActions: React.FC<ContributeActionsProps> = ({
  onSave,
  onClear,
  isSubmitting,
  isValid,
}) => {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();

  const handleSave = () => {
    if (!session) {
      openModal();
      return;
    }
    onSave();
  };

  return (
    <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center">
      <button
        onClick={onClear}
        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        disabled={isSubmitting}
      >
        Clear
      </button>
      
      <button
        onClick={handleSave}
        disabled={isSubmitting || !isValid}
        className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isValid && !isSubmitting
          ? 'bg-blue-600 hover:bg-blue-700'
          : 'bg-blue-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : session ? 'Save Prompt' : 'Sign in to Save'}
      </button>
    </div>
  );
};

export default ContributeActions;
