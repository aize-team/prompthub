# PromptHub - Your AI Prompt Resource

This project is a resource for discovering, sharing, and utilizing effective prompts for Large Language Models (LLMs).

## About Aize

This project is inspired by [Aize](https://aize.dev), a company dedicated to boosting productivity and unleashing creativity through the power of AI. Aize offers a suite of AI-driven tools designed to streamline workflows and enhance creative processes.

Aize believes that the key to unlocking AI's potential lies in crafting precise and effective prompts. That's why we encourage you to explore the prompts available here and use them with Aize's chat interface at [chat.aize.dev](https://chat.aize.dev) for an optimized and innovative AI experience.

With Aize, you can:

*   Harness AI coding assistance: Select from different Gemini models tailored for your coding tasks.
*   Utilize multimodal prompting: Generate full-stack applications with natural language, images, and drawing tools, including the App Prototyping agent (initially Next.js apps).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Docker Image

The GitHub Actions workflow builds a Docker image and publishes it to the
[GitHub Container Registry](https://ghcr.io). Each build is tagged with the
semantic version from `package.json` as well as `latest`.

You can pull the image using:

```bash
docker pull ghcr.io/<your-org>/prompthub:<version>
```
