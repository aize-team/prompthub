import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request, context: any) {
  // Return 503 Service Unavailable if Firebase is not initialized
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { 
        status: 503, 
        headers: { 
          'Retry-After': '60',
          'Cache-Control': 'no-store'
        } 
      }
    );
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    const id = context.params?.id;
    if (!id) {
      return NextResponse.json(
        { error: 'Prompt ID is required' },
        { 
          status: 400,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    const data = await request.json();
    if (!data?.title || !data?.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { 
          status: 400,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Only allow the original author to update
    const promptRef = db.collection('prompts').doc(id);
    const promptDoc = await promptRef.get();
    
    if (!promptDoc.exists) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { 
          status: 404,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    const promptData = promptDoc.data();
    if (promptData?.user_id && promptData.user_id !== session.user.email) {
      return NextResponse.json(
        { error: 'Not authorized' },
        { 
          status: 403,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Update prompt
    await promptRef.update({
      ...data,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    });

    return NextResponse.json(
      { success: true },
      { 
        headers: { 
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to update prompt' },
      { 
        status: 500,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }
}
