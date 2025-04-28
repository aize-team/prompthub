import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'prompts.json');

export async function POST(
  request: NextRequest,
  context: any
) {
  const { id } = context.params;

  try {
    // Read the data file
    const fileContent = readFileSync(dataFilePath, 'utf-8');
    const prompts = JSON.parse(fileContent);

    const promptIndex = prompts.findIndex((p: any) => p.id === id);

    if (promptIndex === -1) {
      return NextResponse.json({ message: 'Prompt not found' }, { status: 404 });
    }

    prompts[promptIndex].copies = (prompts[promptIndex].copies || 0) + 1;

    writeFileSync(dataFilePath, JSON.stringify(prompts, null, 2), 'utf-8');

    return NextResponse.json({ message: 'Copy count updated', copies: prompts[promptIndex].copies });
  } catch (error) {
    console.error('Error updating copy count:', error);
    return NextResponse.json({ message: 'Error updating copy count' }, { status: 500 });
  }
}
