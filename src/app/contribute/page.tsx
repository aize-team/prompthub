'use client';

import React, { Suspense } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import PromptIdeaForm from '@/components/contribute/PromptIdeaForm';
import { Skeleton } from '@/components/ui/skeleton';

function ContributeContent() {
  const { t } = useLanguage();
  
  return <PromptIdeaForm />;
}

// Wrapper component that handles the Suspense boundary
function ContributePage() {
  return (
    <Suspense fallback={<Skeleton className="w-full h-screen" />}>
      <ContributeContent />
    </Suspense>
  );
}

export default ContributePage;
