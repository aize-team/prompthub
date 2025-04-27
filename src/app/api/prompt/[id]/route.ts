import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';


export const dynamic = "force-dynamic";

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