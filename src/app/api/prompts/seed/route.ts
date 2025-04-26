import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { PromptDetail } from '@/lib/prompt-data';

export async function POST(request: NextRequest) {
    try {
        const { prompts } = await request.json() as { prompts: PromptDetail[] };

        if (!prompts || !Array.isArray(prompts)) {
            return NextResponse.json(
                { error: 'Invalid prompts data provided' },
                { status: 400 }
            );
        }

        const batch = db.batch();
        const promptsRef = db.collection('prompts');

        // First delete all existing prompts (optional - remove this if you want to keep existing data)
        const existingPrompts = await promptsRef.get();
        existingPrompts.forEach(doc => {
            batch.delete(doc.ref);
        });

        // Add all prompts in batch
        for (const prompt of prompts) {
            const docRef = prompt.id ?
                promptsRef.doc(prompt.id) :
                promptsRef.doc(); // Auto-generate ID if none exists

            // Remove the id field from the data to prevent duplication
            const { id, ...promptData } = prompt;
            batch.set(docRef, promptData);
        }

        // Commit the batch
        await batch.commit();

        return NextResponse.json({
            success: true,
            message: `Successfully seeded ${prompts.length} prompts to database`
        });
    } catch (error) {
        console.error('Error seeding prompts:', error);
        return NextResponse.json(
            { error: 'Failed to seed prompts to database' },
            { status: 500 }
        );
    }
} 