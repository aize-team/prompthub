import React from 'react';

interface AutoSaveStatusProps {
  status: 'idle' | 'saving' | 'saved';
}

const statusText: Record<string, string> = {
  idle: '',
  saving: 'Saving...',
  saved: 'Saved!',
};

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ status }) => {
  if (status === 'idle') return null;
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
      {status === 'saving' && (
        <svg className="animate-spin h-3 w-3 text-blue-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      <span>{statusText[status]}</span>
    </div>
  );
};

export default AutoSaveStatus;
