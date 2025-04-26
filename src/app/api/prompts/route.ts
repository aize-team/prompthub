import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

export const dynamic = "force-static";

export async function GET() {
  try {
    const promptsRef = db.collection('prompts');
    const snapshot = await promptsRef.get();

    const prompts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    return NextResponse.json({ error: 'Failed to fetch prompts' }, { status: 500 });
  }
}