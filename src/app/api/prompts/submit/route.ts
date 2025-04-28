import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { v4 as uuidv4 } from 'uuid';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Create a new prompt document
    const promptData = {
      id: uuidv4(),
      title: data.title,
      content: data.content,
      description: data.description || '',
      useCases: data.useCases || [],
      category: data.category || 'General',
      tags: data.tags || [],
      author: session.user.name || session.user.email || 'Anonymous',
      likes: 0,
      copies: 0,
      createdAt: new Date().toISOString(),
    };

    // Add document to Firestore
    await db.collection('prompts').doc(promptData.id).set(promptData);

    return NextResponse.json({ success: true, prompt: promptData });
  } catch (error) {
    console.error('Error submitting prompt:', error);
    return NextResponse.json({ error: 'Failed to submit prompt' }, { status: 500 });
  }
}
