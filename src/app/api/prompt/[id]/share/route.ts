import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, context: any) {
  if (!db) {
    console.warn('Firebase is not initialized - running in build mode');
    return NextResponse.json(
      { error: 'Service temporarily unavailable' },
      { status: 503, headers: { 'Retry-After': '60', 'Cache-Control': 'no-store' } }
    );
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json(
      { error: 'Prompt ID is required' },
      { status: 400, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const promptDoc = await db.collection('prompts').doc(id).get();
    if (!promptDoc.exists) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const promptData = promptDoc.data();
    return NextResponse.json(
      { id: promptDoc.id, ...promptData },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error('Error fetching prompt share:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve prompt data' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
