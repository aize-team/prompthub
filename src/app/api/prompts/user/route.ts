import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

// Define interface for prompt data
interface Prompt {
    id: string;
    author?: string;
    user_id?: string;
    title?: string;
    content?: string;
    createdAt?: {
        seconds: number;
        nanoseconds: number;
    };
    [key: string]: any; // For any other fields
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get user email as unique identifier
        const userEmail = session.user.email;
        if (!userEmail) {
            return NextResponse.json({ error: 'User identifier not found' }, { status: 400 });
        }

        // Query Firestore for prompts created by this user (by user_id field first, falling back to author)
        const promptsRef = db.collection('prompts');

        // Try to get prompts by user_id first
        let snapshot = await promptsRef
            .where('user_id', '==', userEmail)
            .get();

        // If no prompts found by user_id, try to find by author (legacy data)
        if (snapshot.empty) {
            snapshot = await promptsRef
                .where('author', '==', userEmail)
                .get();
        }

        let prompts: Prompt[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Sort by createdAt in memory instead of in the query
        prompts = prompts.sort((a, b) => {
            // Handle missing createdAt fields
            if (!a.createdAt) return 1;
            if (!b.createdAt) return -1;

            // Sort in descending order (newest first)
            return b.createdAt.seconds - a.createdAt.seconds;
        }).slice(0, 10); // Limit to 10 items

        return NextResponse.json(prompts);
    } catch (error) {
        console.error('Error fetching user prompts:', error);
        return NextResponse.json({ error: 'Failed to fetch user prompts' }, { status: 500 });
    }
} 