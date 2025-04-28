'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuthModal } from '@/context/AuthModalContext'; // Import the hook
import { useSession, signOut } from 'next-auth/react'; // Import hooks for session management

const Header = () => {
  const { t, direction } = useLanguage();
  const { openModal } = useAuthModal(); // Use the hook
  const { data: session, status } = useSession(); // Get session data

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsMobileMenuOpen(false); // Close mobile menu on sign out
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-all duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-200 dark:border-gray-800'
      }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <img src="/logo.png" alt="Aize Logo" className="w-full h-full object-cover rounded-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Aize <span className="text-blue-600 dark:text-blue-400">|</span> Prompts
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.explore')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            {/* Added Contribute Link */}
            <Link href="/contribute" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.contribute')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="https://chat.aize.dev/" target="_blank" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.chat')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Sign In/Sign Out Button and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {status === 'authenticated' ? (
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={openModal} // Call openModal on click
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
              >
                {t('header.signin')}
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-4 mb-6">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link
                href="/explore"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.explore')}
              </Link>
              {/* Added Contribute Link */}
              <Link
                href="/contribute"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.contribute')}
              </Link>
              <Link
                href="https://chat.aize.dev/"
                target="_blank"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('header.chat')}
              </Link>
            </nav>

            <div className="flex flex-col space-y-4 pb-2">
              <div className="flex justify-center">
                <LanguageSwitcher />
              </div>
              {status === 'authenticated' ? (
                <button
                  onClick={handleSignOut}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => { openModal(); setIsMobileMenuOpen(false); }} // Open modal and close mobile menu
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-md"
                >
                  {t('header.signin')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
