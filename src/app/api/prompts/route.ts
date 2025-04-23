import { NextResponse } from 'next/server';

export async function GET() {
  const prompts = [
    {
      id: '1',
      title: 'Generate Marketing Slogans',
      content: 'Create catchy and memorable slogans for a new product or service.',
      useCases: ['Marketing', 'Branding'],
      category: 'Marketing',
      tags: ['slogans', 'branding', 'creativity'],
    },
    {
      id: '2',
      title: 'Write a Blog Post Outline',
      content: 'Generate a structured outline for a blog post on a given topic.',
      useCases: ['Content Creation', 'Blogging'],
      category: 'Writing',
      tags: ['blogging', 'outlines', 'content'],
    },
    {
      id: '3',
      title: 'Code Debugging',
      content: 'Identify and fix errors in a provided code snippet.',
      useCases: ['Software Development', 'Debugging'],
      category: 'Coding',
      tags: ['debugging', 'code', 'errors'],
    },
        {
      id: '4',
      title: 'Generate Social Media Captions',
      content: 'Write engaging captions for various social media platforms.',
      useCases: ['Social Media Marketing', 'Content Creation'],
      category: 'Marketing',
      tags: ['social media', 'captions', 'engagement'],
    },
        {
      id: '5',
      title: 'Compose an Email',
      content: 'Draft professional emails for different scenarios.',
      useCases: ['Communication', 'Professional Writing'],
      category: 'Writing',
      tags: ['email', 'communication', 'professional'],
    },
  ];

  return NextResponse.json(prompts);
}