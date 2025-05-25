'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Notification from '@/components/ui/Notification';

// Simple icon components since we can't import Lucide icons directly
interface IconProps {
  className?: string;
}

const CopyIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const DownloadIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ShareIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"></circle>
    <circle cx="6" cy="12" r="3"></circle>
    <circle cx="18" cy="19" r="3"></circle>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
    <line x1="15.41" y1="6.51" x2="8.47" y2="10.49"></line>
  </svg>
);

const CheckIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

interface PromptActionsProps {
  title: string;
  content: string;
  promptId?: string;
  className?: string;
}

export default function PromptActions({ 
  title, 
  content, 
  promptId, 
  className = '' 
}: PromptActionsProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>({ show: false, type: 'info', message: '' });

  const showNotification = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      showNotification('success', t('prompt.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotification('error', t('prompt.copy-failed'));
    }
  };

  const handleExport = () => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_prompt.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification('success', t('prompt.exported'));
    } catch (err) {
      console.error('Export failed:', err);
      showNotification('error', t('prompt.export-failed'));
    }
  };

  const handleShare = () => {
    if (!promptId) {
      showNotification('error', t('prompt.save-before-share'));
      return;
    }
    
    const url = `${window.location.origin}/prompt/${promptId}`;
    
    if (navigator.share) {
      navigator.share({
        title: title,
        text: content.substring(0, 100) + '...',
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        showNotification('success', t('prompt.link-copied'));
      }).catch(console.error);
    }
  };

  const handleShareJson = () => {
    if (!promptId) {
      showNotification('error', t('prompt.save-before-share'));
      return;
    }

    const url = `${window.location.origin}/api/prompt/${promptId}/share`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        showNotification('success', t('prompt.link-copied'));
      })
      .catch(console.error);
  };

  const buttonClass = "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
  const iconClass = 'h-4 w-4';

  return (
    <div className="relative">
      {notification.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <Notification 
            type={notification.type} 
            message={notification.message} 
            show={notification.show}
            onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          />
        </div>
      )}
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          type="button"
          onClick={handleCopy}
          className={buttonClass}
          aria-label={t('prompt.copy')}
        >
          {copied ? (
            <CheckIcon className={iconClass} />
          ) : (
            <CopyIcon className={iconClass} />
          )}
          <span className="hidden sm:inline">{t('prompt.copy')}</span>
        </button>
        
        <button
          type="button"
          onClick={handleExport}
          className={buttonClass}
          aria-label={t('prompt.export')}
        >
          <DownloadIcon className={iconClass} />
          <span className="hidden sm:inline">{t('prompt.export')}</span>
        </button>
        
        {promptId && (
          <button
            type="button"
            onClick={handleShare}
            className={buttonClass}
            aria-label={t('prompt.share')}
          >
            <ShareIcon className={iconClass} />
            <span className="hidden sm:inline">{t('prompt.share')}</span>
          </button>
        )}

        {promptId && (
          <button
            type="button"
            onClick={handleShareJson}
            className={buttonClass}
            aria-label={t('prompt.share-json')}
          >
            <ShareIcon className={iconClass} />
            <span className="hidden sm:inline">{t('prompt.share-json')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
