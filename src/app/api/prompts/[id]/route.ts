import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, context: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const id = context.params?.id;
    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    // Only allow the original author to update
    const promptRef = db.collection('prompts').doc(id as string);
    const promptDoc = await promptRef.get();
    if (!promptDoc.exists) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }
    const promptData = promptDoc.data();
    if (promptData?.user_id && promptData.user_id !== session.user?.email) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Update prompt
    await promptRef.update({
      ...data,
      updatedAt: {
        seconds: Math.floor(Date.now() / 1000),
        nanoseconds: (Date.now() % 1000) * 1000000
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating prompt:', error);
    return NextResponse.json({ error: 'Failed to update prompt' }, { status: 500 });
  }
}
