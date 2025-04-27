import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = "force-dynamic";

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

export function generateStaticParams() {
  return prompts.map((prompt) => ({
    id: prompt.id,
  }));
}

export async function GET(request: NextRequest, context: any) {
  const { id } = context.params;
  try {
    // Query Firestore for the prompt with the given ID
    const promptDoc = await db.collection('prompts').doc(id).get();

    if (!promptDoc.exists) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    // Return the prompt data with the ID included
    const promptData = promptDoc.data();
    return NextResponse.json({
      id: promptDoc.id,
      ...promptData
    });
  } catch (error) {
    console.error('Error fetching prompt by ID:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve prompt data' },
      { status: 500 }
    );
  }
}