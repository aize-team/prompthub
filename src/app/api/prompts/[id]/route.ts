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

    const params = await context.params;
    const id = params?.id;
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
    console.log('Debug - Prompt user_id:', promptData?.user_id);
    console.log('Debug - Current user email:', session.user.email);
    
    // Allow update if:
    // 1. The user is the original author (user_id matches session email), or
    // 2. The prompt is anonymous and the user is logged in (we'll update the user_id to the logged-in user)
    const isAuthor = promptData?.user_id === session.user.email;
    const isAnonymousPrompt = promptData?.isAnonymous && promptData?.user_id !== session.user.email;
    
    if (!isAuthor && !isAnonymousPrompt) {
      console.log('Debug - Authorization failed: user not authorized to update this prompt');
      return NextResponse.json(
        { 
          error: 'Not authorized', 
          promptUserId: promptData?.user_id, 
          currentUserEmail: session.user.email,
          isAnonymous: promptData?.isAnonymous
        },
        { 
          status: 403,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // Prepare update data
    const updateData: any = {
      ...data,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    };

    // If this was an anonymous prompt being claimed by a logged-in user
    if (isAnonymousPrompt) {
      console.log('Claiming anonymous prompt for user:', session.user.email);
      updateData.user_id = session.user.email;
      updateData.isAnonymous = false;
      updateData.user_details = {
        email: session.user.email,
        name: session.user.name || session.user.email,
        image: session.user.image || null,
      };
      updateData.author = session.user.name || session.user.email;
    }

    // Update prompt
    await promptRef.update(updateData);

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
