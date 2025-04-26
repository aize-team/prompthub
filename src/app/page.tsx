'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPrompts, getAllTags, PromptDetail } from '@/lib/prompt-data';
import { useLanguage } from '@/context/LanguageContext';

const Home = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [prompts, setPrompts] = useState<PromptDetail[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, direction } = useLanguage();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allPromptData = await fetchPrompts();
        setPrompts(allPromptData);
        const tagData = await getAllTags();
        setTags(tagData.slice(0, 8));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get prompts for different sections
  const popularPrompts = prompts.slice(0, 3);
  const featuredPrompts = prompts.slice(3, 6);
  const recentPrompts = [...prompts].sort(() => 0.5 - Math.random()).slice(0, 4);

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <div className={direction === 'rtl' ? 'rtl' : ''}>
      {/* Hero Section - Modern with animated elements */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 md:py-28">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 dark:bg-blue-900/30 blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-purple-100 dark:bg-purple-900/30 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-indigo-100 dark:bg-indigo-900/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Hero content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {t('hero.discover')}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  {t('hero.ai-powered')}
                </span>
              </h1>

              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
                {t('hero.description')}
              </p>

              {/* Search bar with form submission */}
              <div className="max-w-xl mx-auto lg:mx-0 mb-8">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('hero.search')}
                    className="w-full py-4 px-6 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg text-gray-700 dark:text-gray-200"
                  />
                  <button
                    type="submit"
                    className={`absolute ${direction === 'rtl' ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link href="/explore" passHref>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-8 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
                    {t('hero.explore-all')}
                  </button>
                </Link>
                <Link href="/signin" passHref>
                  <button className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium py-3 px-8 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105">
                    {t('header.signin')}
                  </button>
                </Link>
              </div>
            </div>

            {/* Hero image/illustration */}
            <div className="lg:w-1/2 relative">
              <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform rotate-1 hover:rotate-0 transition-all duration-500">
                <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">A</span>
                </div>
                <div className="mb-4 mt-4 pt-2">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Prompt Example</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Creative Writing Assistant</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                  You are an expert creative writing assistant. Help me craft a compelling short story about [THEME] that incorporates elements of [GENRE] and features a character who [CHARACTER TRAIT]. The story should be approximately [LENGTH] and suitable for [AUDIENCE].
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">#writing</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">#creative</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">#storytelling</span>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 transform -rotate-3 hover:rotate-0 transition-all duration-500 w-64 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                    P
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Programming Helper</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                  Explain complex code patterns and help debug issues...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular tags section with modern design */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{t('tags.popular')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('tags.discover')}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {tags.map((tag: string) => (
              <Link key={tag} href={`/explore?search=${encodeURIComponent(tag)}`}>
                <span className="inline-block bg-white dark:bg-gray-800 px-5 py-3 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
                  #{tag}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/explore" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors">
              {t('tags.view-all')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Prompts Section with modern card design */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('featured.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('featured.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPrompts.map((prompt: PromptDetail) => (
              <div key={prompt.id} className="group">
                <Link href={`/prompt/${prompt.id}`}>
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800/50 transform group-hover:-translate-y-2">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <div className="p-6 flex-grow">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold mr-3">
                          {prompt.title.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 flex-1 truncate">
                          {prompt.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{prompt.content}</p>
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {prompt.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">AI Prompt</span>
                      <span className="text-blue-600 dark:text-blue-400 text-sm font-medium group-hover:underline">{t('featured.view-details')} →</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/explore" passHref>
              <button className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium py-3 px-8 rounded-lg border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 shadow-sm hover:shadow-md">
                {t('featured.view-all')} <span className="ml-1">→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* What are Prompts Section with modern design */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold mb-6">
                  {t('prompts.what')}
                </h2>
                <p className="text-blue-100 mb-6">Unlock the full potential of AI with well-crafted prompts</p>
                <div className="hidden md:block">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 opacity-20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
              </div>
              <div className="md:w-3/5 p-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  {t('prompts.description')}
                </p>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-600">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Common Platforms:</h3>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://chat.aize.dev/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-yellow-300 dark:from-amber-600 dark:to-yellow-400 px-3 py-1 rounded text-sm font-medium text-white dark:text-white shadow-sm font-bold hover:from-amber-600 hover:to-yellow-400 transition-colors">Aize Chat</a>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">OpenAI ChatGPT</span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">Google Gemini</span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">Anthropic Claude</span>
                    <span className="bg-white dark:bg-gray-800 px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">AI21 Studio</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Prompts Section with modern grid layout */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">{t('recent.title')}</h2>
              <p className="text-gray-600 dark:text-gray-400">{t('recent.description')}</p>
            </div>
            <Link href="/explore" className="mt-4 md:mt-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors">
              {t('recent.view-all')}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPrompts.map((prompt: PromptDetail) => (
              <Link key={prompt.id} href={`/prompt/${prompt.id}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700 group-hover:border-blue-200 dark:group-hover:border-blue-800/50">
                  <div className="p-5 flex-grow">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{prompt.content}</p>
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section with modern step-by-step guide */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('how.title')}</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{t('how.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 relative border border-gray-100 dark:border-gray-700 shadow-md">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">1</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pt-2">{t('how.step1.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('how.step1.description')}</p>
              <div className="text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 relative border border-gray-100 dark:border-gray-700 shadow-md">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">2</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pt-2">{t('how.step2.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('how.step2.description')}</p>
              <div className="text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 relative border border-gray-100 dark:border-gray-700 shadow-md">
              <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">3</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white pt-2">{t('how.step3.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{t('how.step3.description')}</p>
              <div className="text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{t('how.platforms')}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://chat.aize.dev/" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-amber-500 to-yellow-300 dark:from-amber-600 dark:to-yellow-400 px-4 py-2 rounded-lg text-sm font-medium text-white dark:text-white shadow-sm border border-amber-400 dark:border-amber-600 font-bold hover:from-amber-600 hover:to-yellow-400 transition-colors">Aize Chat</a>
              <span className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">OpenAI ChatGPT</span>
              <span className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">Google Gemini</span>
              <span className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">Anthropic Claude</span>
              <span className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">AI21 Studio</span>
              <span className="bg-white dark:bg-gray-900 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700">...and more!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter/CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
          <Link href="/explore" passHref>
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
              {t('cta.button')}
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
