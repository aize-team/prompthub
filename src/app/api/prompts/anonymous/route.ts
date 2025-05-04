import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content) {
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

    return NextResponse.json({
      id: promptData.id,
      ...promptData
    });
  } catch (error) {
    console.error('Error creating anonymous prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}
