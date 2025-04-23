import { NextResponse } from 'next/server';

interface Prompt {
  id: string;
  title: string;
  content: string;
  useCases: string[];
  category: string;
  tags: string[];
}

const prompts: Prompt[] = [
  {
    id: '1',
    title: 'Prompt 1',
    content: 'Content for prompt 1',
    useCases: ['use case 1', 'use case 2'],
    category: 'Category A',
    tags: ['tag1', 'tag2'],
  },
  {
    id: '2',
    title: 'Prompt 2',
    content: 'Content for prompt 2',
    useCases: ['use case 3', 'use case 4'],
    category: 'Category B',
    tags: ['tag3', 'tag4'],
  },
  {
    id: '3',
    title: 'Prompt 3',
    content: 'Content for prompt 3',
    useCases: ['use case 5'],
    category: 'Category A',
    tags: ['tag5', 'tag1'],
  },
];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return new NextResponse(JSON.stringify({ error: 'Prompt not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  return new NextResponse(JSON.stringify(prompt), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}