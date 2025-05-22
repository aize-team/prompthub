'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuthModal } from '@/context/AuthModalContext';
import { useSession, signOut } from 'next-auth/react';
import { useClickAway } from 'react-use';

const Header = () => {
  const { t, direction } = useLanguage();
  const { openModal } = useAuthModal(); // Use the hook
  const { data: session, status } = useSession(); // Get session data

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useClickAway(userMenuRef, () => {
    if (isUserMenuOpen) setIsUserMenuOpen(false);
  });

  // Close user menu when navigating
  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

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
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
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
            <Link href="/contribute" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.contribute')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link href="https://chat.aize.dev/" target="_blank" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors relative group py-2">
              {t('header.chat')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </nav>

          {/* User Menu and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {status === 'authenticated' ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[120px]">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                    <Link
                      href="/myprompts"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={closeUserMenu}
                    >
                      {t('header.myPrompts')}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      {t('header.signout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openModal}
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
          <div className={`md:hidden fixed inset-0 bg-white dark:bg-gray-900 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full p-6 space-y-8">
              <div className="flex justify-between items-center">
                <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 shadow-md">
                    <img src="/logo.png" alt="Aize Logo" className="w-full h-full object-cover rounded-lg" />
                  </div>
                  <span className="text-xl font-bold text-gray-800 dark:text-white">Aize <span className="text-blue-600 dark:text-blue-400">|</span> Prompts</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 flex flex-col space-y-6">
                <Link
                  href="/"
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.home')}
                </Link>
                <Link
                  href="/explore"
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.explore')}
                </Link>
                <Link
                  href="/contribute"
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.contribute')}
                </Link>
                {status === 'authenticated' && (
                  <Link
                    href="/myprompts"
                    className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('header.myPrompts')}
                  </Link>
                )}
                <a
                  href="https://chat.aize.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('header.chat')}
                </a>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <LanguageSwitcher />
                    {status === 'authenticated' ? (
                      <div className="flex flex-col space-y-2 w-full mt-4">
                        <Link
                          href="/myprompts"
                          className="w-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          onClick={closeUserMenu}
                        >
                          {t('header.myPrompts')}
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          {t('header.signout')}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          openModal();
                          setIsMobileMenuOpen(false);
                        }}
                        className="ml-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                      >
                        {t('header.signin')}
                      </button>
                    )}
                  </div>
                  {status === 'authenticated' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      {t('header.loggedInAs')} {session?.user?.email}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
