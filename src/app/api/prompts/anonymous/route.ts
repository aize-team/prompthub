import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { validatePrompt } from '@/lib/prompt-schema';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // Return 503 Service Unavailable if Firebase is not initialized
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503, headers: { 'Retry-After': '60' } }
    );
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!validatePrompt(data)) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Add timestamp and anonymous user info
    const promptData = {
      ...data,
      id: uuidv4(),
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      },
      author: 'Anonymous User',
      user_id: 'anonymous',
      likes: 0,
      copies: 0,
      isAnonymous: true,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    };

    // Create document in Firestore
    await db.collection('prompts').doc(promptData.id).set(promptData);

    return NextResponse.json(promptData);
  } catch (error) {
    console.error('Error creating anonymous prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
