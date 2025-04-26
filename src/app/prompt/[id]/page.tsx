import { Metadata } from 'next';
import { getPromptById, allPrompts } from '@/lib/prompt-data';
import { notFound } from 'next/navigation';
import PromptDetailContent from '@/components/PromptDetailContent';

// Generate static params for all possible prompt IDs
export function generateStaticParams() {
  return allPrompts.map((prompt) => ({
    id: prompt.id,
  }));
}

// Function to generate metadata dynamically
export async function generateMetadata(props: any): Promise<Metadata> {
  const params = await props.params;
  const id = params.id;
  const prompt = getPromptById(id);

  if (!prompt) {
    return {
      title: 'Prompt Not Found',
    };
  }

  return {
    title: `${prompt.title} | Prompt Detail`,
    description: `Details for the AI prompt: ${prompt.title}`,
  };
}

// Main export function
export default async function PromptDetailPage(props: any) {
  const params = await props.params;
  const id = params.id;
  const prompt = getPromptById(id);

  // If prompt not found, use Next.js notFound function to render 404 page
  if (!prompt) {
    notFound();
  }

  return <PromptDetailContent prompt={prompt} />;
}
