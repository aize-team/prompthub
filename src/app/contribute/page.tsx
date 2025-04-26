import React from 'react';

const ContributePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Contribute Your Prompts</h1>
      <p className="mb-4 text-lg">
        Help us grow our collection of effective prompts by sharing your own!
        Your contributions can help others unlock the full potential of LLMs.
      </p>
      <h2 className="text-2xl font-semibold mb-4">How to Contribute</h2>
      <div className="prose dark:prose-invert">
        <p>To add your prompts to PromptHub, follow these steps:</p>
        <ol>
          <li>
            <strong>Fork the repository:</strong> Find our project repository on GitHub and create your own fork.
          </li>
          <li>
            <strong>Clone your fork:</strong> Clone your forked repository to your local machine.
            <pre><code className="bg-gray-100 p-1 rounded text-sm">git clone [your-fork-url]</code></pre>
          </li>
          <li>
            <strong>Add your prompt data:</strong> Open the file <code className="bg-gray-100 p-1 rounded text-sm">src/lib/prompt-data.ts</code>.
            Add your prompt object to the existing array, following the same structure.
            Make sure to give it a unique <code>id</code>.
          </li>
          <li>
            <strong>Commit your changes:</strong> Save the file and commit your changes with a clear message.
            <pre><code className="bg-gray-100 p-1 rounded text-sm">git add src/lib/prompt-data.ts
git commit -m "feat: Add new prompt about [brief description]"</code></pre>
          </li>
          <li>
            <strong>Push to your fork:</strong> Push your committed changes to your fork on GitHub.
            <pre><code className="bg-gray-100 p-1 rounded text-sm">git push origin main</code></pre>
          </li>
          <li>
            <strong>Open a Pull Request:</strong> Go to the original project repository on GitHub and open a new pull request from your fork.
            Provide a clear description of the prompt you added.
          </li>
        </ol>
        <p>
          Our team will review your submission, and if it meets the guidelines, we will merge it into the main project.
          Thank you for contributing!
        </p>
      </div>
    </div>
  );
};

export default ContributePage;
