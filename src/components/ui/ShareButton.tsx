'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface ShareButtonProps {
  url?: string;
  title?: string;
  promptId?: string;
  promptContent?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export default function ShareButton({
  url,
  title = 'Check out this prompt',
  promptId,
  promptContent,
  className = '',
  variant = 'primary',
  size = 'md',
}: ShareButtonProps) {
  const { t, direction } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Use the current URL if none is provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Generate the API share URL if we have a promptId
  const apiShareUrl = promptId ? `${window.location.origin}/api/prompt/${promptId}/share` : null;
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleShare = async () => {
    // Toggle dropdown menu instead of direct sharing
    setShowDropdown(!showDropdown);
  };
  
  const copyToClipboard = (content: string, type: 'url' | 'prompt' | 'id') => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setShowTooltip(true);
    
    // Hide the tooltip after 2 seconds
    setTimeout(() => {
      setShowTooltip(false);
      setTimeout(() => setCopied(null), 300); // Reset copied state after tooltip fade out
    }, 2000);
  };
  
  const shareWithNativeAPI = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          url: shareUrl,
        });
        setShowDropdown(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(shareUrl, 'url');
    }
  };
  
  // Determine button styles based on variant and size
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    outline: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-600',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };
  
  const getTooltipText = () => {
    if (!copied) return t('common.copy-link');
    
    switch (copied) {
      case 'url': return t('prompt.copied-url');
      case 'prompt': return t('prompt.copied-prompt');
      case 'id': return t('prompt.copied-id');
      default: return t('common.copied');
    }
  };
  
  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={handleShare}
        className={`flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        aria-label={t('common.share')}
        aria-expanded={showDropdown}
        aria-haspopup="true"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ${direction === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" 
          />
        </svg>
        {t('common.share')}
      </button>
      
      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute z-50 mt-2 w-56 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" 
          style={{ [direction === 'rtl' ? 'left' : 'right']: 0 }}
          role="menu" 
          aria-orientation="vertical" 
          aria-labelledby="share-button">
          <div className="py-1" role="none">
            <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
              {t('prompt.share-menu')}
            </div>
            
            {/* Share URL option */}
            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                  shareWithNativeAPI();
                } else {
                  copyToClipboard(shareUrl, 'url');
                }
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem"
            >
              <svg className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-5 w-5 text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {t('prompt.share-url')}
            </button>
            
            {/* Share API URL option - only if we have a promptId */}
            {apiShareUrl && (
              <button
                onClick={() => copyToClipboard(apiShareUrl, 'url')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem"
              >
                <svg className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-5 w-5 text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                API URL
              </button>
            )}
            
            {/* Copy Prompt Content - only if we have promptContent */}
            {promptContent && (
              <button
                onClick={() => copyToClipboard(promptContent, 'prompt')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem"
              >
                <svg className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-5 w-5 text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {t('prompt.share-prompt')}
              </button>
            )}
            
            {/* Copy Prompt ID - only if we have promptId */}
            {promptId && (
              <button
                onClick={() => copyToClipboard(promptId, 'id')}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem"
              >
                <svg className={`${direction === 'rtl' ? 'ml-3' : 'mr-3'} h-5 w-5 text-gray-400 dark:text-gray-500`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                {t('prompt.share-id')}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded shadow-lg transition-opacity duration-300 opacity-100 mb-1 whitespace-nowrap z-50">
          {getTooltipText()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900"></div>
        </div>
      )}
    </div>
  );
}
