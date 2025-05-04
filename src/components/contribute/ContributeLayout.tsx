'use client';

import React, { ReactNode } from 'react';

interface ContributeLayoutProps {
  children: ReactNode;
  leftSidebar: ReactNode;
  rightSidebar: ReactNode;
}

const ContributeLayout: React.FC<ContributeLayoutProps> = ({
  children,
  leftSidebar,
  rightSidebar,
}) => {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block">
        {leftSidebar}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Right Sidebar */}
      <div className="w-64 border-l border-gray-200 dark:border-gray-800 overflow-y-auto hidden md:block">
        {rightSidebar}
      </div>
    </div>
  );
};

export default ContributeLayout;
