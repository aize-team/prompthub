"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'fa';
type Direction = 'ltr' | 'rtl';

type LanguageContextType = {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const defaultLanguage: Language = 'en';

// Create the context with a default value
const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  direction: 'ltr',
  setLanguage: () => {},
  t: (key: string) => key,
});

// Translations
const translations = {
  en: {
    // Header
    'header.home': 'Home',
    'header.explore': 'Explore',
    'header.chat': 'Chat',
    'header.signin': 'Sign In',
    
    // Hero section
    'hero.discover': 'Discover & Share',
    'hero.ai-powered': 'AI-Powered Prompts',
    'hero.description': 'PromptHub is an open-source AI prompting tool for modern world to discover, create, and share creative prompts',
    'hero.search': 'Search for tag or username',
    'hero.explore-all': 'Explore All Prompts',
    
    // Popular tags
    'tags.popular': 'Popular Tags',
    'tags.discover': 'Discover prompts by popular categories and topics',
    'tags.view-all': 'View all categories',
    
    // What are prompts
    'prompts.what': 'What Exactly Are Prompts?',
    'prompts.description': 'Prompts are the starting point for your conversations with Large Language Models (LLMs). Think of them as specific instructions, questions, or pieces of context you provide to guide the AI towards generating the text, code, images, or other content you need. A well-crafted prompt is key to unlocking the full potential of platforms like OpenAI\'s ChatGPT, Google\'s Gemini, Anthropic\'s Claude, AI21\'s Jurassic models, and many others.',
    
    // Featured prompts
    'featured.title': 'Featured Prompts',
    'featured.description': 'Discover our collection of high-quality prompts created by the community',
    'featured.view-all': 'View All Prompts',
    'featured.view-details': 'View Details',
    
    // How to use
    'how.title': 'How to Use These Prompts',
    'how.description': 'Simply find a prompt that fits your needs, copy it, and paste it directly into your preferred LLM interface. Experiment and adapt them to achieve the best results!',
    'how.platforms': 'Common Platforms:',
    'how.step1.title': 'Find a Prompt',
    'how.step1.description': 'Browse our collection to find a prompt that matches your needs or search by tags.',
    'how.step2.title': 'Copy the Prompt',
    'how.step2.description': 'Click on a prompt to view details and copy the full text with a single click.',
    'how.step3.title': 'Use with Any AI',
    'how.step3.description': 'Paste the prompt into your favorite AI platform and start generating amazing results.',
    
    // Explore page
    'explore.title': 'Explore Prompts',
    'explore.search-label': 'Search Prompts',
    'explore.search-placeholder': 'Search by title, content, tag...',
    'explore.filter-by-tag': 'Filter by Tag',
    'explore.all-tags': 'All Tags',
    'explore.no-prompts': 'No prompts found matching your criteria.',
    'explore.broaden-search': 'Try broadening your search or clearing the filters.',
    
    // Prompt detail page
    'prompt.uncategorized': 'Uncategorized',
    'prompt.added-recently': 'Added recently',
    'prompt.ai-prompt': 'AI Prompt',
    'prompt.copy': 'Copy',
    'prompt.try-aize': 'Try with Aize Chat',
    'prompt.details': 'Details',
    'prompt.use-cases': 'Use Cases',
    'prompt.no-use-cases': 'No specific use cases provided for this prompt.',
    'prompt.how-to-use': 'How to Use',
    'prompt.step-1': 'Copy the prompt using the copy button above',
    'prompt.step-2': 'Paste it into your preferred AI platform',
    'prompt.step-3': 'Customize the prompt as needed for your specific requirements',
    'prompt.similar': 'Similar Prompts',
    
    // Footer
    'footer.services': 'Services',
    'footer.smart-chat': 'Smart Chat Panel',
    'footer.web-services': 'Web Services',
    'footer.smart-assistants': 'Smart Assistants',
    'footer.benefits': 'Benefits',
    'footer.apis': 'Powerful APIs for Developers',
    'footer.chat-everyone': 'Smart Chat for Everyone',
    'footer.custom-services': 'Custom Services for Special Needs',
    'footer.org-solutions': 'Organizational & Team Solutions',
    'footer.prompt-hub': 'Prompt Hub',
    'footer.home': 'Home',
    'footer.explore': 'Explore Prompts',
    'footer.signin': 'Sign In',
    'footer.rights': 'All rights reserved.',
    
    // Newsletter section
    'newsletter.title': 'Stay updated with the latest prompts',
    'newsletter.description': 'Join our newsletter to receive new prompts, tips, and AI resources directly to your inbox',
    'newsletter.placeholder': 'Your email address',
    'newsletter.subscribe': 'Subscribe',
    
    // Recent Additions section
    'recent.title': 'Recent Additions',
    'recent.description': 'The latest prompts added to our collection',
    'recent.view-all': 'View all prompts',
    
    // CTA section
    'cta.title': 'Ready to enhance your AI interactions?',
    'cta.description': 'Join our community and discover the power of well-crafted prompts',
    'cta.button': 'Get Started Now',
  },
  fa: {
    // Header
    'header.home': 'خانه',
    'header.explore': 'کاوش',
    'header.chat': 'چت',
    'header.signin': 'ورود',
    
    // Hero section
    'hero.discover': 'کشف و اشتراک‌گذاری',
    'hero.ai-powered': 'پرامپت‌های هوش مصنوعی',
    'hero.description': 'پرامپت‌هاب یک ابزار متن‌باز برای دنیای مدرن است تا پرامپت‌های خلاقانه را کشف، ایجاد و به اشتراک بگذارید',
    'hero.search': 'جستجو برای تگ یا نام کاربری',
    'hero.explore-all': 'کاوش همه پرامپت‌ها',
    
    // Popular tags
    'tags.popular': 'تگ‌های محبوب',
    'tags.discover': 'پرامپت‌ها را بر اساس دسته‌بندی‌ها و موضوعات محبوب کشف کنید',
    'tags.view-all': 'مشاهده همه دسته‌بندی‌ها',
    
    // What are prompts
    'prompts.what': 'پرامپت‌ها دقیقاً چه هستند؟',
    'prompts.description': 'پرامپت‌ها نقطه شروع گفتگوهای شما با مدل‌های زبانی بزرگ (LLM) هستند. آنها را به عنوان دستورالعمل‌ها، سوالات یا بخش‌هایی از متن در نظر بگیرید که برای هدایت هوش مصنوعی به سمت تولید متن، کد، تصاویر یا محتوای دیگر ارائه می‌دهید. یک پرامپت خوب طراحی شده کلید آزاد کردن پتانسیل کامل پلتفرم‌هایی مانند ChatGPT از OpenAI، Gemini از Google، Claude از Anthropic، مدل‌های Jurassic از AI21 و بسیاری دیگر است.',
    
    // Featured prompts
    'featured.title': 'پرامپت‌های برجسته',
    'featured.description': 'مجموعه‌ای از پرامپت‌های با کیفیت بالا که توسط جامعه ایجاد شده‌اند را کشف کنید',
    'featured.view-all': 'مشاهده همه پرامپت‌ها',
    'featured.view-details': 'مشاهده جزئیات',
    
    // How to use
    'how.title': 'نحوه استفاده از این پرامپت‌ها',
    'how.description': 'به سادگی پرامپتی را که مناسب نیازهای شما است پیدا کنید، آن را کپی کرده و مستقیماً در رابط LLM مورد نظر خود قرار دهید. آزمایش کنید و آنها را برای دستیابی به بهترین نتایج تطبیق دهید!',
    'how.platforms': 'پلتفرم‌های رایج:',
    'how.step1.title': 'یک پرامپت پیدا کنید',
    'how.step1.description': 'مجموعه ما را برای یافتن پرامپتی که مطابق با نیازهای شماست جستجو کنید یا با تگ‌ها جستجو کنید.',
    'how.step2.title': 'پرامپت را کپی کنید',
    'how.step2.description': 'برای مشاهده جزئیات و کپی کردن متن کامل با یک کلیک، روی یک پرامپت کلیک کنید.',
    'how.step3.title': 'با هر هوش مصنوعی استفاده کنید',
    'how.step3.description': 'پرامپت را در پلتفرم هوش مصنوعی مورد علاقه خود قرار دهید و شروع به تولید نتایج شگفت‌انگیز کنید.',
    
    // Explore page
    'explore.title': 'کاوش پرامپت‌ها',
    'explore.search-label': 'جستجوی پرامپت‌ها',
    'explore.search-placeholder': 'جستجو بر اساس عنوان، محتوا، تگ...',
    'explore.filter-by-tag': 'فیلتر بر اساس تگ',
    'explore.all-tags': 'همه تگ‌ها',
    'explore.no-prompts': 'هیچ پرامپتی مطابق با معیارهای شما یافت نشد.',
    'explore.broaden-search': 'جستجوی خود را گسترده‌تر کنید یا فیلترها را پاک کنید.',
    
    // Prompt detail page
    'prompt.uncategorized': 'دسته‌بندی نشده',
    'prompt.added-recently': 'اخیراً اضافه شده',
    'prompt.ai-prompt': 'پرامپت هوش مصنوعی',
    'prompt.copy': 'کپی',
    'prompt.try-aize': 'امتحان با چت آیز',
    'prompt.details': 'جزئیات',
    'prompt.use-cases': 'موارد استفاده',
    'prompt.no-use-cases': 'موارد استفاده خاصی برای این پرامپت ارائه نشده است.',
    'prompt.how-to-use': 'نحوه استفاده',
    'prompt.step-1': 'پرامپت را با استفاده از دکمه کپی در بالا کپی کنید',
    'prompt.step-2': 'آن را در پلتفرم هوش مصنوعی مورد نظر خود قرار دهید',
    'prompt.step-3': 'پرامپت را بر اساس نیازهای خاص خود سفارشی کنید',
    'prompt.similar': 'پرامپت‌های مشابه',
    'prompt.coding': 'کدنویسی',
    'prompt.development': 'توسعه',
    'prompt.code-generation': 'تولید کد',
    'prompt.programming': 'برنامه‌نویسی',
    
    // Footer
    'footer.services': 'خدمات',
    'footer.smart-chat': 'پنل چت هوشمند',
    'footer.web-services': 'وب سرویس‌ها',
    'footer.smart-assistants': 'دستیارهای هوشمند',
    'footer.benefits': 'مزایا',
    'footer.apis': 'API‌های قدرتمند برای توسعه‌دهندگان',
    'footer.chat-everyone': 'چت هوشمند برای همه',
    'footer.custom-services': 'خدمات اختصاصی برای نیازهای خاص',
    'footer.org-solutions': 'راهکارهای سازمانی و تیمی',
    'footer.prompt-hub': 'پرامپت هاب',
    'footer.home': 'خانه',
    'footer.explore': 'کاوش پرامپت‌ها',
    'footer.signin': 'ورود',
    'footer.rights': 'تمامی حقوق محفوظ است.',
    
    // Newsletter section
    'newsletter.title': 'با آخرین پرامپت‌ها به‌روز بمانید',
    'newsletter.description': 'به خبرنامه ما بپیوندید تا پرامپت‌های جدید، نکات و منابع هوش مصنوعی را مستقیماً در صندوق ورودی خود دریافت کنید',
    'newsletter.placeholder': 'آدرس ایمیل شما',
    'newsletter.subscribe': 'اشتراک',
    
    // Recent Additions section
    'recent.title': 'افزوده‌های اخیر',
    'recent.description': 'جدیدترین پرامپت‌های اضافه شده به مجموعه ما',
    'recent.view-all': 'مشاهده همه پرامپت‌ها',
    
    // CTA section
    'cta.title': 'آماده بهبود تعاملات هوش مصنوعی خود هستید؟',
    'cta.description': 'به جامعه ما بپیوندید و قدرت پرامپت‌های خوب طراحی شده را کشف کنید',
    'cta.button': 'همین حالا شروع کنید',
  },
};

type LanguageProviderProps = {
  children: ReactNode;
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const [direction, setDirection] = useState<Direction>('ltr');
  
  // Load language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fa')) {
      setLanguageState(savedLanguage);
    }
  }, []);
  
  // Update direction when language changes
  useEffect(() => {
    setDirection(language === 'fa' ? 'rtl' : 'ltr');
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);
  
  // Translation function
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };
  
  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
