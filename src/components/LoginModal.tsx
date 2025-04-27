'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-2xl w-full max-w-sm mx-4 transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Sign In
        </h2>
        <div className="flex flex-col space-y-4">
          {/* Updated Keycloak button styling */}
          <button
            onClick={() => signIn("keycloak")}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-base font-medium text-gray-800 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
          >
             {/* Placeholder icon for Keycloak - can be replaced with a proper SVG or image */}
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5a2 2 0 012-2h6z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v.01" />
             </svg>
            Sign in with Keycloak
          </button>
           {/* Add social login buttons back if you still want them, styled similarly */}
           {/* Example for Google (requires re-adding provider in route.ts): */}
           {/*
           <button
             onClick={() => signIn("google")}
             className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-base font-medium text-gray-800 dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-200"
           >
             <img src="/google.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
             Sign in with Google
           </button>
           */}
        </div>
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
