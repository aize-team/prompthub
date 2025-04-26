import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { PromptDetail } from '@/lib/prompt-data';

export async function POST() {
    try {
        // Step 1: Fetch all prompts from the database
        const promptsRef = db.collection('prompts');
        const snapshot = await promptsRef.get();

        const prompts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as PromptDetail[];

        if (prompts.length === 0) {
            return NextResponse.json(
                { message: 'No prompts found to process' },
                { status: 200 }
            );
        }

        // Step 2: Reseed them back (optional - can be modified for different behavior)
        const batch = db.batch();

        // Optional: Clear existing prompts first
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Add all prompts back in batch
        for (const prompt of prompts) {
            const docRef = promptsRef.doc(prompt.id);

            // Remove the id field from the data to prevent duplication
            const { id, ...promptData } = prompt;
            batch.set(docRef, promptData);
        }

        // Commit the batch
        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully fetched and reseeded ${prompts.length} prompts`
        });
    } catch (error) {
        console.error('Error in fetch-and-seed operation:', error);
        return NextResponse.json(
            { error: 'Failed to complete fetch-and-seed operation' },
            { status: 500 }
        );
    }
} 