import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL,
});

async function analyzeAndExpandInput(promptIdea: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "GPT-4.1 Nano",
            messages: [
                {
                    role: "system",
                    content: `You are a highly intelligent assistant. 
                    Analyze the provided prompt and generate concise answers for the following key aspects:
                    
                    - **Main goal of the prompt:** Identify the core subject or request within the provided prompt.
                    - **Persona:** Recommend the most relevant persona for the AI model to adopt (e.g., expert, teacher, conversational, etc.)
                    - **Optimal output length:** Suggest an optimal output length (short, brief, medium, long) based on the task, and give an approximate number of words if it is suitable for the case.
                    - **Most convenient output format:** Recommend the optimal format for the result (e.g., list, paragraph, code snippet, table, JSON, etc.).
                    - **Specific requirements:** Highlight any special conditions, rules, or expectations stated or implied within the prompt.
                    - **Suggested improvements:** Offer recommendations on how to modify or enhance the prompt for more precise or efficient output generation.
                    - **One-shot prompting:** Create one related examples to guide the output generation.
                    
                    Then use them to reformulate and expand the provided prompt.
                    Return the expanded prompt as output in text format. Refrain from explaining the generation process.
                    
                    Example 1:
                    Prompt: "Explain quantum entanglement to a 10-year-old."

                    *thought_process*:
                    - **Main goal of the prompt:** Simplify complex quantum physics concept for children.
                    - **Persona:** Patient, friendly teacher
                    - **Optimal output length:** Brief (100-150 words)
                    - **Most convenient output format:** Narrative with analogy
                    - **Specific requirements:** Age-appropriate explanation (10-year-old).
                    - **Suggested improvements:** 
                        - Request specific analogies
                        - Include interactive elements
                        - Add follow-up questions
                        - Suggest visual aids
                    - **One-shot prompting:**
                    Output example:
                        "Imagine you have two special pairs of socks. When you put one sock in your room and the other sock in the kitchen, 
                        something magical happens! Whatever happens to one sock instantly affects the other sock. 
                        If you turn one sock inside out, the other sock automatically turns inside out too, no matter how far apart they are!" 

                    *output*:
                    As a friendly science teacher, please explain quantum entanglement to a 10-year-old student using these guidelines:

                    Start with a relatable analogy using everyday objects
                    Use simple, clear language avoiding technical terms
                    Include 2-3 interactive examples that demonstrate the concept
                    Add fun facts that will spark curiosity
                    End with simple questions to check understanding
                    Keep the explanation brief (100-150 words)

                    Structure your explanation as:

                    Opening analogy
                    Main explanation with examples
                    Interactive "What if?" scenarios
                    Fun facts about quantum entanglement
                    Check-for-understanding questions`
                },
                {
                    role: "user",
                    content: promptIdea
                }
            ],
            temperature: 0.5
        });

        return response.choices[0].message.content || "";
    } catch (error) {
        console.error("Error in analyzeAndExpandInput:", error);
        return promptIdea;
    }
}

async function decomposeAndAddReasoning(expandedPrompt: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "GPT-4.1 Nano",
            messages: [
                {
                    role: "system",
                    content: `You are a highly capable AI assistant tasked with improving complex task execution. 
                    Analyze the provided prompt, and use it to generate the following output:
                    
                    - **Subtasks decomposition:** Break down the task described in the prompt into manageable and specific subtasks that the AI model needs to address.
                    - **Chain-of-thought reasoning:** For subtasks that involve critical thinking or complex steps, add reasoning using a step-by-step approach to improve decision-making and output quality.
                    - **Success criteria:** Define what constitutes a successful completion for each subtask, ensuring clear guidance for expected results.
                    
                    Return the following structured output for each subtask:
                    
                    1. **Subtask description**: Describe a specific subtask.
                    2. **Reasoning**: Provide reasoning or explanation for why this subtask is essential or how it should be approached.
                    3. **Success criteria**: Define what successful completion looks like for this subtask.
                    
                    Example 1:
                    Prompt: "Explain how machine learning models are evaluated using cross-validation."

                    ##THOUGHT PROCESS##
                    *Subtask 1*:
                    - **Description**: Define cross-validation and its purpose.
                    - **Reasoning**: Clarifying the concept ensures the reader understands the basic mechanism behind model evaluation.
                    - **Success criteria**: The explanation should include a clear definition of cross-validation and its role in assessing model performance.
                    *Subtask 2*:
                    - **Description**: Describe how cross-validation splits data into training and validation sets.
                    - **Reasoning**: Explaining the split is crucial to understanding how models are validated and tested for generalization.
                    - **Success criteria**: A proper explanation of k-fold cross-validation with an illustration of how data is split.
                    *Subtask 3*:
                    - **Description**: Discuss how cross-validation results are averaged to provide a final evaluation metric.
                    - **Reasoning**: Averaging results helps mitigate the variance in performance due to different training/validation splits.
                    - **Success criteria**: The output should clearly explain how the final model evaluation is derived from multiple iterations of cross-validation.`
                },
                {
                    role: "user",
                    content: expandedPrompt
                }
            ],
            temperature: 0.5
        });

        return response.choices[0].message.content || "";
    } catch (error) {
        console.error("Error in decomposeAndAddReasoning:", error);
        return "";
    }
}

async function suggestEnhancements(promptIdea: string) {
    try {
        const response = await openai.chat.completions.create({
            model: "GPT-4.1 Nano",
            messages: [
                {
                    role: "system",
                    content: `You are a highly intelligent assistant specialized in reference suggestion and tool integration.
                    Analyze the provided input prompt to recommend enhancements:
                    
                    - **Reference necessity:** Determine if additional reference materials would benefit the task execution (e.g., websites, documentations, books, articles, etc.)
                    - **Expected impact:** Estimate the potential improvement in output quality
                    
                    If enhancements are warranted, provide structured recommendations in this format:
                    
                    ##REFERENCE SUGGESTIONS##
                    (Only if applicable, maximum 3)
                    - Reference name/type
                    - Purpose: How it enhances the output
                    - Integration: How to incorporate it
                    
                    If no enhancements would significantly improve the output, return an empty string ""`
                },
                {
                    role: "user",
                    content: promptIdea
                }
            ],
            temperature: 0.5
        });

        return response.choices[0].message.content || "";
    } catch (error) {
        console.error("Error in suggestEnhancements:", error);
        return "";
    }
}

async function generateStructuredPrompt(components: any) {
    const { expandedPrompt, decompositionAndReasoning, suggestedEnhancements, promptIdea } = components;
    try {
        const response = await openai.chat.completions.create({
            model: "GPT-4.1 Nano",
            messages: [
                {
                    role: "system",
                    content: `You are an expert prompt engineer with deep knowledge of AI language models. Your task is to analyze the provided components and transform them into a highly effective, structured prompt that will produce consistent, high-quality results.

                    Return a JSON object with the following fields:
                    - title: A concise, descriptive title for the prompt (max 60 chars)
                    - content: A refined, structured version of the prompt that begins with a clear role definition (e.g., "You are an expert mathematician") followed by specific instructions with {variables} for customizable parts
                    - tags: A comma-separated list of 3-7 relevant tags that accurately categorize the prompt
                    - category: One of [General, Writing, Coding, Education, Other]
                    - model: One of [Any, GPT-4, GPT-3.5, Claude, Gemini, Other]
                    - promptType: One of [Question, Instruction, Conversation, Role-playing, Other]
                    - complexityLevel: One of [Beginner, Intermediate, Advanced, Expert]
                    - useCases: An array of use cases from [Content Creation, Data Analysis, Problem Solving, Creative Writing, Coding, Learning, Business, Personal]
                    - tips: Specific, actionable advice for using the prompt effectively and getting the best results
                    - example: A brief example input to demonstrate how to use the prompt
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
                    
                    Don't include any explanation outside the JSON.`
                },
                {
                    role: "user",
                    content: `Original Prompt Idea: ${promptIdea}\n\n` +
                        `Expanded Prompt: ${expandedPrompt}\n\n` +
                        `Decomposition and Reasoning: ${decompositionAndReasoning}\n\n` +
                        `Suggested Enhancements: ${suggestedEnhancements}`
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
        console.error("Error in generateStructuredPrompt:", error);
        return simulatePromptAnalysis(promptIdea);
    }
}

async function processPromptWithLLM(promptIdea: string) {
    try {
        // Step 1: Analyze and expand the input prompt
        const expandedPrompt = await analyzeAndExpandInput(promptIdea);

        // Step 2: Decompose the expanded prompt and add reasoning
        const decompositionAndReasoning = await decomposeAndAddReasoning(expandedPrompt);

        // Step 3: Suggest enhancements for the prompt
        const suggestedEnhancements = await suggestEnhancements(promptIdea);

        // Step 4: Generate the final structured prompt
        const components = {
            expandedPrompt,
            decompositionAndReasoning,
            suggestedEnhancements,
            promptIdea
        };

        return await generateStructuredPrompt(components);
    } catch (error) {
        console.error("Error in advanced prompt generation pipeline:", error);
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