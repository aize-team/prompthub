import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

async function processPromptWithLLM(promptIdea: string) {
    try {
        // Call the OpenAI API
        const response = await openai.chat.completions.create({
            model: "GPT-4.1 Nano",
            messages: [
                {
                    role: "system",
                    content:
                        `You are an expert prompt engineer with deep knowledge of AI language models. Your task is to analyze the user's prompt idea and transform it into a highly effective, structured prompt that will produce consistent, high-quality results.

          First, identify the core purpose and desired outcome of the user's request. Then, create a comprehensive prompt with a clear role definition and specific instructions.

          Return a JSON object with the following fields:
          - title: A concise, descriptive title for the prompt (max 60 chars)
          - content: A refined, structured version of their prompt that begins with a clear role definition (e.g., "You are an expert mathematician") followed by specific instructions with {variables} for customizable parts
          - tags: A comma-separated list of 3-7 relevant tags that accurately categorize the prompt
          - category: One of [General, Writing, Coding, Education, Other]
          - model: One of [Any, GPT-4, GPT-3.5, Claude, Gemini, Other]
          - promptType: One of [Question, Instruction, Conversation, Role-playing, Other]
          - complexityLevel: One of [Beginner, Intermediate, Advanced, Expert]
          - useCases: An array of use cases from [Content Creation, Data Analysis, Problem Solving, Creative Writing, Coding, Learning, Business, Personal]
          - tips: Specific, actionable advice for using the prompt effectively and getting the best results
          - exampleOutput: A brief example of expected output to demonstrate the prompt's effectiveness
          - expectedResponse: Format of expected response (e.g., "Bulleted list", "Step-by-step guide", "Detailed analysis")
          - contextLength: One of [Very Short, Short, Medium, Long, Very Long]
          
          IMPORTANT GUIDELINES:
          1. ALWAYS begin the content with a clear role definition (e.g., "You are an expert [profession/role]")
          2. Structure the prompt with clear sections (context, task, constraints, format)
          3. Include specific instructions on how the AI should respond
          4. Use {variables} for parts the user will customize
          5. Keep the language clear and concise
          6. The prompt should be in English unless the user explicitly requests another language
          7. Ensure all fields match the expected values and format
          
          Don't include any explanation outside the JSON.
          `
                },
                {
                    role: "user",
                    content: promptIdea
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        // Parse the JSON response
        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("No content in response");
        }

        const result = JSON.parse(content);

        // Ensure useCases is an array
        if (typeof result.useCases === 'string') {
            result.useCases = result.useCases.split(',').map((uc: string) => uc.trim());
        }

        return result;
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        // Fall back to simulated analysis if API fails
        return simulatePromptAnalysis(promptIdea);
    }
}

// Keep the simulation function as a fallback
function simulatePromptAnalysis(promptIdea: string) {
    // Extract potential title from the prompt idea
    const titleMatch = promptIdea.match(/(?:create|generate|make|build|design).*?(?:for|that|to)\s+(.*?)(?:\.|\,|\n|$)/i);
    let title = titleMatch ? titleMatch[1].trim() : "";

    // Capitalize title and limit length
    if (title) {
        title = title.charAt(0).toUpperCase() + title.slice(1);
        title = title.length > 50 ? title.substring(0, 47) + "..." : title;
    } else {
        // Fallback title generation
        const words = promptIdea.split(" ");
        const keyWords = words.filter(word => word.length > 4).slice(0, 3);
        title = keyWords.join(" ").trim();
        title = title.charAt(0).toUpperCase() + title.slice(1);
    }

    // Generate tags from the prompt idea
    const commonWords = ["the", "and", "for", "that", "with", "this", "have", "from"];
    const potentialTags = promptIdea
        .toLowerCase()
        .split(/[\s,\.]+/)
        .filter(word => word.length > 3 && !commonWords.includes(word))
        .filter((value, index, self) => self.indexOf(value) === index)
        .slice(0, 5);

    // Detect potential category
    let category = "General";
    if (promptIdea.match(/code|program|develop|algorithm|script|function|class|method/i)) {
        category = "Coding";
    } else if (promptIdea.match(/write|blog|article|content|story|essay|book|poem/i)) {
        category = "Writing";
    } else if (promptIdea.match(/learn|teach|student|education|course|lecture|explain|understand/i)) {
        category = "Education";
    }

    // Detect prompt type
    let promptType = "Instruction";
    if (promptIdea.match(/\?/)) {
        promptType = "Question";
    } else if (promptIdea.match(/conversation|chat|dialogue|discuss/i)) {
        promptType = "Conversation";
    } else if (promptIdea.match(/role|play|character|act as|pretend|simulate/i)) {
        promptType = "Role-playing";
    }

    // Detect complexity level
    let complexityLevel = "Intermediate";
    const wordCount = promptIdea.split(/\s+/).length;
    if (wordCount < 15) {
        complexityLevel = "Beginner";
    } else if (wordCount > 50) {
        complexityLevel = "Advanced";
    }

    // Determine use cases
    const useCases = [];
    if (promptIdea.match(/blog|article|content|write|story|essay|book/i)) {
        useCases.push("Content Creation");
        useCases.push("Creative Writing");
    }
    if (promptIdea.match(/analyze|data|statistics|trends|insights|patterns/i)) {
        useCases.push("Data Analysis");
    }
    if (promptIdea.match(/solution|solve|problem|challenge|fix|resolve/i)) {
        useCases.push("Problem Solving");
    }
    if (promptIdea.match(/code|program|develop|app|website|application/i)) {
        useCases.push("Coding");
    }
    if (promptIdea.match(/learn|study|education|teach|understand|concept/i)) {
        useCases.push("Learning");
    }
    if (promptIdea.match(/business|company|startup|product|market|customer/i)) {
        useCases.push("Business");
    }

    // If no use cases detected, add a default
    if (useCases.length === 0) {
        useCases.push("Content Creation");
    }

    // Format the prompt content
    let content = promptIdea;
    // Look for potential variables
    const variableMatches = promptIdea.match(/\b(topic|concept|subject|idea|theme|field|domain)\b/gi);
    if (variableMatches) {
        const uniqueVars = [...new Set(variableMatches.map(v => v.toLowerCase()))];
        uniqueVars.forEach(variable => {
            content = content.replace(new RegExp(`\\b${variable}\\b`, 'gi'), `{${variable}}`);
        });
    }

    // Truncate content if too long
    if (content.length > 480) {
        content = content.substring(0, 477) + "...";
    }

    // Generate a tip
    let tips = "";
    if (content.includes("{")) {
        tips = "Replace the variables in curly braces with your specific inputs.";
    } else {
        tips = "For best results, provide specific details in your query.";
    }

    // Determine model based on prompt complexity
    let model = "Any";
    if (complexityLevel === "Advanced" || complexityLevel === "Expert") {
        model = "GPT-4";
    } else if (promptType === "Role-playing") {
        model = "Claude";
    }

    return {
        title,
        content,
        tags: potentialTags.join(", "),
        category,
        model,
        promptType,
        complexityLevel,
        useCases,
        tips,
        // For simplicity, we're leaving these empty
        exampleOutput: "",
        expectedResponse: "",
        contextLength: wordCount < 20 ? "Short" : wordCount > 50 ? "Long" : "Medium",
    };
}

export async function POST(request: Request) {
    try {
        const { promptIdea } = await request.json();

        if (!promptIdea) {
            return NextResponse.json(
                { error: "Prompt idea is required" },
                { status: 400 }
            );
        }

        // Check if OpenAI API key is configured
        if (process.env.OPENAI_API_KEY) {
            // Use OpenAI to process the prompt
            const processedPrompt = await processPromptWithLLM(promptIdea);
            return NextResponse.json(processedPrompt);
        } else {
            console.warn("OpenAI API key not found, falling back to simulation");
            // Fall back to simulation if API key is not configured
            const processedPrompt = simulatePromptAnalysis(promptIdea);
            return NextResponse.json(processedPrompt);
        }
    } catch (error) {
        console.error("Error processing prompt:", error);
        return NextResponse.json(
            { error: "Failed to process prompt" },
            { status: 500 }
        );
    }
} 