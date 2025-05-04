import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'prompts.json');

export async function POST(
  request: NextRequest,
  context: any
) {
  const { id } = (await context.params);

  try {
    // Read the data file
    const fileContent = readFileSync(dataFilePath, 'utf-8');
    const prompts = JSON.parse(fileContent);

    // Find the prompt by ID
    const promptIndex = prompts.findIndex((p: any) => p.id === id);

    if (promptIndex === -1) {
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 });
    }

    // Increment the like count
    prompts[promptIndex].likes = (prompts[promptIndex].likes || 0) + 1;

    // Write the updated data back to the file
    writeFileSync(dataFilePath, JSON.stringify(prompts, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Like count updated', likes: prompts[promptIndex].likes });
  } catch (error) {
    console.error('Error updating like count:', error);
    return NextResponse.json({ message: 'Error updating like count' }, { status: 500 });
  }
}
