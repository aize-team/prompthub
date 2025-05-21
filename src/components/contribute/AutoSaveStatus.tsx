import React from 'react';

interface AutoSaveStatusProps {
  status: 'idle' | 'saving' | 'saved';
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

const statusText: Record<string, string> = {
  idle: '',
  saving: 'Saving...',
  saved: 'Saved!',
};

const formatTimeAgo = (date: Date | null): string => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 
        ? `1 ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
};

export const AutoSaveStatus: React.FC<AutoSaveStatusProps> = ({ 
  status, 
  lastSaved, 
  hasUnsavedChanges 
}) => {
  console.log('AutoSaveStatus rendering', { status, lastSaved, hasUnsavedChanges });
  return (
    <div className="flex items-center gap-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Auto-save:</div>
      {/* Saving indicator */}
      {status === 'saving' && (
        <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="font-medium">Saving...</span>
        </div>
      )}
      
      {/* Saved indicator */}
      {status === 'saved' && (
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Saved</span>
        </div>
      )}
      
      {/* Status text */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {status === 'saving' && 'Saving changes...'}
        {status === 'saved' && `Saved ${formatTimeAgo(lastSaved)}`}
        {status === 'idle' && hasUnsavedChanges && 'Unsaved changes'}
        {status === 'idle' && !hasUnsavedChanges && lastSaved && `Last saved ${formatTimeAgo(lastSaved)}`}
      </div>
      
      {/* Unsaved changes indicator */}
      {hasUnsavedChanges && status === 'idle' && (
        <div className="h-3 w-3 rounded-full bg-yellow-400 animate-pulse"></div>
      )}
    </div>
  );
};

export default AutoSaveStatus;
