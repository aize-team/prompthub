"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import PromptHistorySidebar from "@/components/PromptHistorySidebar";

const availableCategories = [
  "General",
  "Writing",
  "Coding",
  "Education",
  "Other",
];
const availableModels = [
  "Any",
  "GPT-4",
  "GPT-3.5",
  "Claude",
  "Gemini",
  "Other",
];
const availablePromptTypes = [
  "Question",
  "Instruction",
  "Conversation",
  "Role-playing",
  "Other",
];
const availableComplexityLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];
const availableUseCases = [
  "Content Creation",
  "Data Analysis",
  "Problem Solving",
  "Creative Writing",
  "Coding",
  "Learning",
  "Business",
  "Personal",
];

function randomPromptTemplate() {
  return {
    title: "Blog Idea Generator",
    content: `Suggest 5 unique blog post ideas about {topic}, each with a catchy title and summary.`,
    tags: "blogging,ideas,writing",
    category: "Writing",
    model: "Any",
    example:
      '1. "The Art of Minimalism" — Tips and habits for living simply...',
    tips: "Replace {topic} with your subject.",
    promptType: "Instruction",
    complexityLevel: "Beginner",
    useCases: ["Content Creation", "Creative Writing"],
    exampleOutput: "",
    expectedResponse: "List with explanations",
    contextLength: "Short",
  };
}

export default function ContributePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const displayName = session?.user?.name ?? session?.user?.email ?? "";

  const [step, setStep] = useState(1);
  const [promptIdea, setPromptIdea] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<any>(null);

  const [form, setForm] = useState({
    id: "",
    title: "",
    content: "",
    tags: "",
    category: "",
    model: "",
    example: "",
    tips: "",
    promptType: "",
    complexityLevel: "",
    useCases: [] as string[],
    exampleOutput: "",
    expectedResponse: "",
    contextLength: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState({ title: 0, content: 0 });
  const [successMessage, setSuccessMessage] = useState("");

  // Add useEffect to load cached form data or prompt data from URL parameter
  useEffect(() => {
    // Check URL for prompt ID parameter
    const queryParams = new URLSearchParams(window.location.search);
    const promptId = queryParams.get("id");

    if (promptId) {
      // Fetch the prompt data by ID
      const fetchPromptData = async () => {
        try {
          const response = await fetch(`/api/prompt/${promptId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch prompt data");
          }
          const promptData = await response.json();
          
          // Store original prompt for comparison
          setOriginalPrompt(promptData);
          setIsEditMode(true);
          
          // Format the data for the form
          setForm({
            id: promptData.id || "",
            title: promptData.title || "",
            content: promptData.content || "",
            tags: Array.isArray(promptData.tags) ? promptData.tags.join(", ") : (promptData.tags || ""),
            category: promptData.category || "",
            model: promptData.model || "",
            example: promptData.example || "",
            tips: promptData.tips || "",
            promptType: promptData.promptType || "",
            complexityLevel: promptData.complexityLevel || "",
            useCases: Array.isArray(promptData.useCases) ? promptData.useCases : [],
            exampleOutput: promptData.exampleOutput || "",
            expectedResponse: promptData.expectedResponse || "",
            contextLength: promptData.contextLength || "",
          });
          
          setCharCount({
            title: promptData.title?.length || 0,
            content: promptData.content?.length || 0,
          });
          
          // Skip to step 2
          setStep(2);
        } catch (error) {
          console.error("Error fetching prompt data:", error);
          setError("Failed to load prompt data. Please try again.");
        }
      };
      
      fetchPromptData();
    } else {
      // Check if there's cached form data in localStorage
      const cachedForm = localStorage.getItem("cachedPromptForm");
      const cachedStep = localStorage.getItem("cachedPromptStep");
      const cachedEditMode = localStorage.getItem("cachedEditMode");
      const cachedOriginalPrompt = localStorage.getItem("cachedOriginalPrompt");

      if (cachedForm) {
        try {
          const parsedForm = JSON.parse(cachedForm);
          setForm(parsedForm);
          setCharCount({
            title: parsedForm.title?.length || 0,
            content: parsedForm.content?.length || 0,
          });

          // If there was a cached step, restore it
          if (cachedStep) {
            setStep(parseInt(cachedStep, 10));
          }
          
          // Restore edit mode if it was cached
          if (cachedEditMode) {
            setIsEditMode(cachedEditMode === "true");
          }
          
          // Restore original prompt if it was cached
          if (cachedOriginalPrompt) {
            try {
              const parsedOriginalPrompt = JSON.parse(cachedOriginalPrompt);
              setOriginalPrompt(parsedOriginalPrompt);
            } catch (e) {
              console.error("Error parsing cached original prompt:", e);
            }
          }

          // Clean up localStorage
          localStorage.removeItem("cachedPromptForm");
          localStorage.removeItem("cachedPromptStep");
          localStorage.removeItem("cachedEditMode");
          localStorage.removeItem("cachedOriginalPrompt");
          
          console.log("Restored cached form data", {
            isEditMode: cachedEditMode === "true",
            step: cachedStep ? parseInt(cachedStep, 10) : 1,
            hasOriginalPrompt: !!cachedOriginalPrompt
          });
        } catch (e) {
          console.error("Error parsing cached form data:", e);
        }
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "title" || name === "content") {
      setCharCount((c) => ({
        ...c,
        [name]: value.length,
      }));
    }
  };

  const handlePromptIdeaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setPromptIdea(e.target.value);
  };

  const handleUseCaseChange = (useCase: string) => {
    setForm((prev) => {
      const useCases = [...prev.useCases];
      if (useCases.includes(useCase)) {
        return { ...prev, useCases: useCases.filter((uc) => uc !== useCase) };
      } else {
        return { ...prev, useCases: [...useCases, useCase] };
      }
    });
  };

  const fillPromptTemplate = () => {
    const template = randomPromptTemplate();
    setForm(template);
    setCharCount({
      title: template.title.length,
      content: template.content.length,
    });
  };

  const processPromptIdea = async () => {
    if (!promptIdea.trim()) {
      setError("Please enter your prompt idea");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // This would be an API call to your LLM service
      // For demo purposes, we'll simulate a response
      const response = await fetch("/api/process-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptIdea }),
      });

      if (!response.ok) {
        throw new Error("Failed to process prompt");
      }

      const data = await response.json();

      // Update the form with the processed data
      setForm(prev => ({
        ...prev,
        title: data.title || "",
        content: data.content || "",
        tags: data.tags || "",
        category: data.category || "",
        model: data.model || "",
        promptType: data.promptType || "",
        complexityLevel: data.complexityLevel || "",
        useCases: data.useCases || [],
        tips: data.tips || ""
      }));

      setCharCount({
        title: data.title?.length || 0,
        content: data.content?.length || 0,
      });

      // Move to step 2
      setStep(2);
    } catch (err) {
      setError("Failed to process your prompt. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!form.title || !form.content) {
      setError("Title and prompt content are required.");
      return;
    }

    // Check if user is signed in for final submission
    if (!session) {
      // Cache the current form data, step, and edit mode in localStorage
      localStorage.setItem("cachedPromptForm", JSON.stringify(form));
      localStorage.setItem("cachedPromptStep", step.toString());
      localStorage.setItem("cachedEditMode", isEditMode.toString());
      if (originalPrompt) {
        localStorage.setItem("cachedOriginalPrompt", JSON.stringify(originalPrompt));
      }

      // Show login modal
      setShowLoginModal(true);
      return;
    }

    setSubmitting(true);
    try {
      // Format the tags properly
      const formattedTags = Array.isArray(form.tags)
        ? form.tags
        : form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean);
      
      // Prepare the payload
      const payload = {
        ...form,
        tags: formattedTags,
        author: displayName,
        updatedAt: new Date().toISOString(),
        ...(isEditMode ? {} : { createdAt: new Date().toISOString() }),
      };
      
      // Determine if we're updating an existing prompt or creating a new one
      const url = isEditMode && form.id ? `/api/prompt/${form.id}` : "/api/prompts";
      const method = isEditMode && form.id ? "PUT" : "POST";
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} prompt with ${method} to ${url}`);
      
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} prompt`);
      }
      
      const result = await response.json();
      console.log(`Prompt ${isEditMode ? 'updated' : 'created'} successfully:`, result);

      // Refresh the prompt history if possible
      if (typeof window !== 'undefined' && (window as any).refreshPromptHistory) {
        (window as any).refreshPromptHistory();

        // Show success message and clear form
        setForm({
          id: "",
          title: "",
          content: "",
          tags: "",
          category: "",
          model: "",
          example: "",
          tips: "",
          promptType: "",
          complexityLevel: "",
          useCases: [] as string[],
          exampleOutput: "",
          expectedResponse: "",
          contextLength: "",
        });

        setCharCount({ title: 0, content: 0 });
        setStep(1);  // Go back to first step
        setIsEditMode(false);
        setOriginalPrompt(null);

        // Show temporary success message
        const successMsg = isEditMode ? "Prompt updated successfully!" : "Prompt saved successfully!";
        setSuccessMessage(successMsg);
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } else {
        // If refresh function not available, redirect to home
        router.push("/?success=true");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectPrompt = (prompt: any) => {
    const newForm = {
      title: prompt.title || "",
      content: prompt.content || "",
      tags: Array.isArray(prompt.tags)
        ? prompt.tags.join(", ")
        : typeof prompt.tags === "string"
          ? prompt.tags
          : "",
      category: prompt.category || "",
      model: prompt.model || "",
      example: prompt.example || "",
      tips: prompt.tips || "",
      promptType: prompt.promptType || "",
      complexityLevel: prompt.complexityLevel || "",
      useCases: Array.isArray(prompt.useCases) ? prompt.useCases : [],
      exampleOutput: prompt.exampleOutput || "",
      expectedResponse: prompt.expectedResponse || "",
      contextLength: prompt.contextLength || "",
    };

    setForm(newForm);
    setCharCount({
      title: newForm.title.length,
      content: newForm.content.length,
    });
    setStep(2); // Go to form step
    setShowSidebar(false); // Hide sidebar on mobile
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Add a Login Modal component
  const LoginModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Sign In</h2>
            <button 
              onClick={() => setShowLoginModal(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to sign in to save your prompt. Your work will be preserved.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/api/auth/signin/github"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Continue with GitHub
            </Link>
            
            <Link
              href="/api/auth/signin/google"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </Link>
            
            <button
              onClick={() => setShowLoginModal(false)}
              className="w-full text-center py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Step 1: Prompt Idea Entry
  if (step === 1) {
    return (
      <div className="container mx-auto p-4 mb-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          {isEditMode ? "✏️ Edit Existing Prompt" : "✨ Create a Prompt"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          {isEditMode
            ? "Make changes to the existing prompt to improve it"
            : "Let's transform your idea into an effective AI prompt"}
        </p>
        
        {/* Show original content when in edit mode */}
        {isEditMode && originalPrompt && (
          <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Original Prompt Content
            </h2>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 mb-3">
              <p className="text-gray-700 dark:text-gray-300 font-mono text-sm whitespace-pre-wrap">{originalPrompt.content}</p>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              You're editing this prompt. Your changes will be saved as an update to the original.  
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{successMessage}</p>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <label className="block mb-3 font-medium text-lg text-gray-700 dark:text-gray-300 text-center">
                Describe your prompt idea in detail
              </label>
              <textarea
                value={promptIdea}
                onChange={handlePromptIdeaChange}
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                placeholder="Explain what you want your prompt to do. The more details you provide, the better we can help refine it. Example: 'I want a prompt that helps generate blog post ideas about sustainable living with catchy titles and brief descriptions.'"
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={processPromptIdea}
                disabled={processing}
                className={clsx(
                  "px-8 py-3 rounded-full text-white font-medium shadow-md transition-all duration-300",
                  processing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg",
                )}
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>Create My Prompt</span>
                )}
              </button>
            </div>
          </div>

          {session && (
            <div className="mt-6 text-center">
              <button
                onClick={toggleSidebar}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                {showSidebar ? "Hide" : "Show"} your previous prompts
              </button>

              {showSidebar && (
                <div className="mt-4 max-h-80 overflow-hidden rounded-xl shadow-lg">
                  <PromptHistorySidebar onSelectPrompt={handleSelectPrompt} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Refined Prompt Form
  return (
    <div className="container mx-auto p-4 mb-20">
      {showLoginModal && <LoginModal />}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar for larger screens */}
        <div className="hidden md:block md:w-1/4 lg:w-1/5">
          <div className="sticky top-4">
            <PromptHistorySidebar onSelectPrompt={handleSelectPrompt} />
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleSidebar}
            className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300"
          >
            <span>{showSidebar ? "Hide" : "Show"} Prompt History</span>
            <svg
              className={`w-4 h-4 ml-2 transition-transform ${showSidebar ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {showSidebar && (
            <div className="mt-4 mb-6">
              <PromptHistorySidebar onSelectPrompt={handleSelectPrompt} />
            </div>
          )}
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            📝 Refine Your Prompt
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            We've analyzed your idea and created a draft. Refine it and save when ready.
          </p>

          {!session && (
            <div className="mb-6 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 text-amber-700 dark:text-amber-300">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium">Sign in to save your prompt</p>
                  <p className="text-sm">You need to be signed in to save your prompt to the community</p>
                  <Link
                    href="/api/auth/signin"
                    className="mt-2 inline-block text-amber-700 dark:text-amber-300 hover:underline font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between">
              <button
                type="button"
                className="group px-4 py-2 text-sm rounded-full bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200 flex items-center gap-2 font-medium"
                onClick={() => setStep(1)}
              >
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                <span>Back</span>
              </button>

              <button
                type="button"
                className="group px-4 py-2 text-sm rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all duration-200 flex items-center gap-2 font-medium"
                onClick={fillPromptTemplate}
              >
                <span>Try an Example</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <svg
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Title <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 ml-2 font-normal">
                      ({charCount.title}/60 chars)
                    </span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    maxLength={60}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="E.g., Blog Idea Generator, Code Refactor Helper..."
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Prompt Content <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 ml-2 font-normal">
                      ({charCount.content}/500 chars)
                    </span>
                  </label>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    required
                    rows={5}
                    maxLength={500}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Write your prompt here. Use {variables} for customizable parts, e.g., 'Explain {concept} in simple terms.'"
                  />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Use {"{variables}"} for parts that users can customize
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Tags{" "}
                      <span className="text-gray-400 font-normal">
                        (comma-separated)
                      </span>
                    </label>
                    <input
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                      placeholder="E.g., writing, creativity, business"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Add keywords to help others find your prompt
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select a category</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Prompt Type
                    </label>
                    <select
                      name="promptType"
                      value={form.promptType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select a prompt type</option>
                      {availablePromptTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Complexity Level
                    </label>
                    <select
                      name="complexityLevel"
                      value={form.complexityLevel}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select complexity</option>
                      {availableComplexityLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Use Cases & Models Section */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 sm:p-8 rounded-xl border border-green-100 dark:border-green-900/30">
              <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Use Cases & Models
              </h2>
              <p className="text-sm text-green-700 dark:text-green-400 mb-6">
                Where this prompt works best
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Use Cases
                  </label>
                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 max-h-48 overflow-y-auto grid grid-cols-2 gap-2">
                    {availableUseCases.map((uc) => (
                      <label
                        key={uc}
                        className="inline-flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={form.useCases.includes(uc)}
                          onChange={() => handleUseCaseChange(uc)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="text-sm">{uc}</span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Select all that apply
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Suggested Model
                    </label>
                    <select
                      name="model"
                      value={form.model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Any Model</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Which AI model works best?
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                      Context Length
                    </label>
                    <select
                      name="contextLength"
                      value={form.contextLength}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    >
                      <option value="">Select length</option>
                      <option value="Very Short">Very Short</option>
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                      <option value="Very Long">Very Long</option>
                    </select>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      How much context is needed?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples & Tips Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 sm:p-8 rounded-xl border border-amber-100 dark:border-amber-900/30">
              <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-4">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Examples & Tips
              </h2>
              <p className="text-sm text-amber-700 dark:text-amber-400 mb-6">
                Help others understand how to use your prompt
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                    <span>
                      Example Input{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      Show how to use the prompt
                    </span>
                  </label>
                  <textarea
                    name="example"
                    value={form.example}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 font-mono text-sm"
                    placeholder='Example: "Generate 5 blog post ideas about minimalism"'
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                    <span>
                      Example Output{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      Show what results to expect
                    </span>
                  </label>
                  <textarea
                    name="exampleOutput"
                    value={form.exampleOutput}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200 font-mono text-sm"
                    placeholder='# Sample Output
    1. "The Art of Minimalism" — Tips and habits for living simply...
    2. "Digital Detox Challenge" — A 7-day plan to reduce screen time...'
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                    <span>
                      Expected Response Format{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      What format should the AI output?
                    </span>
                  </label>
                  <select
                    name="expectedResponse"
                    value={form.expectedResponse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                  >
                    <option value="">Select format</option>
                    <option value="Text">Text</option>
                    <option value="List">List</option>
                    <option value="List with explanations">
                      List with explanations
                    </option>
                    <option value="Table">Table</option>
                    <option value="JSON">JSON</option>
                    <option value="Markdown">Markdown</option>
                    <option value="Code">Code</option>
                    <option value="Step-by-step">Step-by-step</option>
                    <option value="Conversation">Conversation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300 flex justify-between">
                    <span>
                      Prompt Tips/Instructions{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                      Advice for best results
                    </span>
                  </label>
                  <textarea
                    name="tips"
                    value={form.tips}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-200"
                    placeholder="Any advice for using this prompt effectively? E.g., 'Replace {topic} with your specific subject' or 'Works best with detailed context'"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className={clsx(
                  "px-8 py-3 rounded-full text-white font-medium shadow-md transition-all duration-300",
                  submitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 hover:shadow-lg",
                )}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Saving Prompt...</span>
                  </div>
                ) : (
                  <span>Save Prompt</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
