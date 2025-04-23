import Link from 'next/link';
import PromptCard from '@/components/PromptCard'; // Import the refactored component
import { allPrompts } from '@/lib/prompt-data'; // Import the centralized data

const Home = () => {
  // Get the first 3 prompts as samples for the home page
  const popularPrompts = allPrompts.slice(0, 3);

  return (
    // Main background gradient
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200">
      {/* Hero Section - Updated gradient, added subtle text animation potential */}
      <section className="py-20 text-center bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 dark:from-indigo-800 dark:via-purple-900 dark:to-pink-800 text-white shadow-lg relative overflow-hidden">
        {/* Optional: Add subtle animated background shapes/patterns here if desired */}
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-down">
            Unlock the Power of AI Prompts
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-indigo-100 dark:text-indigo-200 animate-fade-in-up delay-300">
            Your central hub for discovering, sharing, and utilizing effective prompts for any LLM.
          </p>
           <div className="flex justify-center space-x-4">
             <Link href="/explore" passHref> {/* Link to the new explore page */}
               <button className="bg-white text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 dark:bg-gray-100 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
                 Explore All Prompts
               </button>
             </Link>
             {/* You could add another button here, e.g., "Create Prompt" */}
           </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-16">
        {/* What are Prompts Section */}
        <section className="mb-16 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            What Exactly Are Prompts?
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Prompts are the starting point for your conversations with Large Language Models (LLMs). Think of them as specific instructions, questions, or pieces of context you provide to guide the AI towards generating the text, code, images, or other content you need. A well-crafted prompt is key to unlocking the full potential of platforms like OpenAI's ChatGPT, Google's Gemini, Anthropic's Claude, AI21's Jurassic models, and many others.
          </p>
        </section>

        {/* Featured Prompts Section (Previously Popular) */}
        <section id="featured-prompts" className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
            Featured Prompts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
           <div className="text-center mt-12">
             <Link href="/explore" passHref>
               <button className="text-purple-600 dark:text-purple-400 font-semibold hover:text-purple-800 dark:hover:text-purple-200 transition duration-300">
                 View All Prompts &rarr;
               </button>
             </Link>
           </div>
        </section>

        {/* How to Use Section */}
        <section className="mb-12 bg-gradient-to-tl from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-blue-900/30 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-semibold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            How to Use These Prompts
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Simply find a prompt that fits your needs, copy it, and paste it directly into your preferred LLM interface. Experiment and adapt them to achieve the best results!
          </p>
          <div className="text-center">
             <p className="text-lg text-gray-700 dark:text-gray-300">Common Platforms:</p>
            <ul className="list-none p-0 inline-flex flex-wrap justify-center gap-2 mt-4">
                <li className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">OpenAI ChatGPT</li>
                <li className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">Google Gemini</li>
                <li className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">Anthropic Claude</li>
                <li className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">AI21 Studio</li>
                <li className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">...and more!</li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 py-8 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>&copy; {new Date().getFullYear()} Prompt Directory. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

// Note: Ensure animation keyframes for animate-fade-in-* are defined in globals.css or tailwind.config.js
