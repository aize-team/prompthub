import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

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
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const promptId = uuidv4(); // Generate prompt ID upfront
    let userId: string;
    let authorName: string;
    let isAnonymous: boolean;
    let anonymousSessionId: string | null = null;
    let userDetails: any;
    const now = new Date();
    const timestamp = {
        seconds: Math.floor(now.getTime() / 1000),
        nanoseconds: (now.getTime() % 1000) * 1000000
    };

    if (session?.user?.email) {
      // Authenticated user
      userId = session.user.email;
      authorName = data.author || session.user.name || session.user.email;
      isAnonymous = false;
      userDetails = {
        email: session.user.email,
        name: session.user.name || null,
        image: session.user.image || null,
      };
    } else {
      // Anonymous user
      anonymousSessionId = uuidv4();
      userId = anonymousSessionId; // Store anonymousSessionId as user_id for the prompt
      authorName = 'Anonymous User';
      isAnonymous = true;
      userDetails = {
        email: null,
        name: 'Anonymous User',
        image: null,
      };
    }

    const promptData = {
      id: promptId,
      title: data.title,
      content: data.content,
      description: data.description || '',
      useCases: data.useCases || [],
      category: data.category || 'General',
      tags: data.tags || [],
      author: authorName,
      user_id: userId,
      user_details: userDetails,
      isAnonymous: isAnonymous,
      likes: 0,
      copies: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // Create document in Firestore with the explicit ID
    await db.collection('prompts').doc(promptId).set(promptData);

    const responsePayload: any = { ...promptData };
    if (isAnonymous && anonymousSessionId) {
      responsePayload.anonymousSessionId = anonymousSessionId;
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    console.error('Error creating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    );
  }
}