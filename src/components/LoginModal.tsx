'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (provider: string) => {
    setIsLoading(true);
    signIn(provider);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md mx-4 border dark:border-gray-700"
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Sign in to access your account
          </p>

          <div className="flex flex-col space-y-4">
            <button
              onClick={() => handleSignIn("keycloak")}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-base font-medium text-gray-800 dark:text-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-70"
            >
              <img src="/google.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
              {isLoading ? "Signing in..." : "Continue with Google"}
            </button>

            <button
              onClick={() => handleSignIn("github")}
              disabled={isLoading}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm text-base font-medium text-gray-800 dark:text-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-70"
            >
              <img src="/github.svg" alt="GitHub Logo" className="w-5 h-5 mr-3" />
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </button>

            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
                  Or
                </span>
              </div>
            </div>

            <button
              onClick={() => handleSignIn("credentials")}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:translate-y-[-2px] disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? "Signing in..." : "Demo Sign In"}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Privacy Policy
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
