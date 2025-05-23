import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    // Get all prompts
    const promptsSnapshot = await db.collection('prompts').get();
    const tagCounts: Record<string, number> = {};

    // Count tag occurrences
    promptsSnapshot.forEach((doc) => {
      const prompt = doc.data();
      let tags: string[] = [];

      if (Array.isArray(prompt.tags)) {
        tags = prompt.tags.map((tag: string) => tag.toLowerCase());
      } else if (typeof prompt.tags === 'string') {
        tags = prompt.tags
          .split(',')
          .map((tag: string) => tag.trim().toLowerCase())
          .filter(Boolean);
      }

      tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Get top 5 most used tags
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1]) // Sort by count descending
      .slice(0, 5) // Take top 5
      .map(([tag]) => tag) // Extract just the tag names
      .sort(); // Sort alphabetically for consistent display

    return NextResponse.json({ tags: topTags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
