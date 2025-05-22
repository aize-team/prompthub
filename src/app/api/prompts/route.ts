import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

export async function GET() {
  // Return empty array if Firebase is not initialized (build time)
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode, returning empty array');
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  }

  try {
    const promptsRef = db.collection('prompts');
    const snapshot = await promptsRef.get();

    const prompts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(prompts, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' }
    });
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500, 
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }
}

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
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get user details - use email as the unique identifier
    const userId = session.user.email || '';
    const authorName = data.author || session.user.name || session.user.email || 'Anonymous User';

    // Add timestamp and user info
    const promptData = {
      ...data,
      createdAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      },
      // Store both display name and user ID
      author: authorName,
      user_id: userId,
      // Include available user info for future reference
      user_details: {
        email: session.user.email || null,
        name: session.user.name || null,
        image: session.user.image || null
      },
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    };

    // Create document in Firestore
    const docRef = await db.collection('prompts').add(promptData);

    return NextResponse.json({
      id: docRef.id,
      ...promptData
    });
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}